function getFirstName(fullName) {
  if (!fullName) return "";
  let clean = fullName.replace(/,?\s*(Esq\.?|JD|MD|M\.D\.?|Ph\.?D\.?|Jr\.?|Sr\.?|[IVX]+)$/i, "").trim();
  clean = clean.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, "").trim();
  const parts = clean.split(/\s+/);
  return parts[0] || fullName;
}

// run_batch_1.js — Orchestrator for Batch 1 Outreach
const fs = require('fs');
const path = require('path');
const { validateSafetyGuard, sendEmailViaAppleMail, registerSent, sleep } = require('./dispatch_batch_1_gmail');

// Load target universe
const targetsPath = path.resolve(__dirname, '../data/ingested-targets.json');
const targetData = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
const targetsByTicker = {};
targetData.targets.forEach(t => {
  targetsByTicker[t.ticker] = t;
});

// Load vetted Batch 1 list
const summaryPath = '/tmp/cross_ref_summary.json';
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const batch1Contacts = summary.unsent_clean.slice(0, 25);

console.log(`Loaded ${batch1Contacts.length} high-priority targets for Batch 1.`);

function buildPersonalizedEmail(target, contact) {
  const companyName = target.name || target.ticker;
  const ticker = target.ticker;
  const cik = target.cik;
  const subRaw = (target.asset && target.asset.subsidiaryName) ? target.asset.subsidiaryName : 'Operating Subsidiary';
  const subName = subRaw.replace(/&#x2019;/g, "'");
  const rev = (target.asset && target.asset.annualRevenue) || 0;
  const revStr = rev >= 1000000 ? `$${(rev / 1000000).toFixed(1)}M` : `$${rev.toLocaleString()}`;
  
  const triggers = (target.vehicleDistress && target.vehicleDistress.secTriggers) || [];
  const triggerDesc = triggers[0] || 'recent regulatory distress filings';
  
  const playbook = (target.extractionFeasibility && target.extractionFeasibility.recommendedPlaybook) || 'consensual_carveout';
  const playbookTitle = playbook.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const name = contact.name;
  const firstName = getFirstName(name);
  const title = contact.title;
  const isLegal = /counsel|legal|esq|attorney/i.test(title);
  
  let subject = '';
  let body = '';
  
  if (isLegal) {
    subject = `CONFIDENTIAL / FOR TRANSMISSION TO BOARD: ${companyName} (${ticker}) — ${playbookTitle} / Carve-Out Restructuring Framework (Attn: ${name})`;
    body = `Dear ${firstName},

I hope this message finds you well. I am reaching out to you directly in your capacity as lead legal counsel advising ${companyName} (CIK: ${cik} • ${ticker}) across its corporate restructuring and SEC disclosure matters.

We represent an institutional special situations capital consortium specializing in solvent operating subsidiary carve-outs, senior debt recapitalizations, and clean public corporate restructurings. We have conducted preliminary analysis on ${companyName}'s filings on SEC EDGAR (including disclosures regarding ${triggerDesc}).

While parent-level capital structure obligations create ongoing complexity, the underlying operating business (${subName}, generating approximately ${revStr} in commercial revenue) represents a viable, high-quality enterprise that would thrive unencumbered.

We propose a consensual transaction framework structured to maximize creditor recovery and protect stakeholder value:

1. Ring-Fenced Operating Subsidiary Isolation: Structure a clean carve-out of ${subName} under a consensual ${playbookTitle} or Article 9 disposition.
2. Direct Creditor Compromise & Liquidity Injection: Dedicate institutional capital to resolve senior secured obligations and provide non-dilutive working capital for ongoing operations.
3. Clean Corporate Parent Preservation: Shield board fiduciaries from liquidation risk while delivering tangible recovery for parent stakeholders.

We would appreciate the opportunity to discuss this framework with your restructuring team or connect with company leadership under a standard bilateral NDA.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@gmail.com`;
  } else {
    subject = `CONFIDENTIAL: ${companyName} (${ticker}) — Dedicated Carve-Out Capital & Subsidiary Recapitalization Proposal (${subName})`;
    body = `Dear ${firstName},

I am writing to you directly in your capacity as ${title} of ${companyName} (${ticker} • CIK: ${cik}).

Our investment group specializes in special situations recapitalizations, solvent subsidiary carve-outs, and consensual corporate restructurings. We have closely followed ${companyName}'s recent SEC EDGAR disclosures (including ${triggerDesc}).

While ${companyName}'s corporate parent structure faces balance sheet headwinds, the core operations of ${subName} (generating ${revStr} in revenue) remain an exceptional, commercially proven asset. 

We are prepared to structure a consensual transaction (${playbookTitle}) that achieves the following:

1. Direct Capital Injection & Debt Resolution: Satisfy outstanding senior secured claims and provide unencumbered working capital directly to ${subName} to safeguard payroll, vendor contracts, and client operations.
2. Parent Overhead Relief: Extinguish default obligations and insulate corporate fiduciaries from insolvency risk.
3. Retained Value for Stakeholders: Provide ${companyName} with substantial carried equity or debt consideration in an unencumbered platform.

We would welcome a confidential 15-minute discussion under NDA this week to review terms and discuss how we can partner with management. 

Respectfully,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@gmail.com`;
  }
  
  return { subject, body };
}

// Dry run audit verification
console.log('--- PRE-DISPATCH VALIDATION ---');
let allPassed = true;
const preparedEmails = [];

for (const c of batch1Contacts) {
  const target = targetsByTicker[c.ticker];
  if (!target) {
    console.error(`Target not found for ticker ${c.ticker}`);
    allPassed = false;
    continue;
  }
  
  const guard = validateSafetyGuard(c.email);
  if (!guard.ok) {
    console.error(`Safety guard failed for ${c.email}: ${guard.reason}`);
    allPassed = false;
    continue;
  }
  
  const { subject, body } = buildPersonalizedEmail(target, c);
  preparedEmails.push({
    ticker: c.ticker,
    company: target.name,
    recipient: c.name,
    title: c.title,
    email: c.email,
    subject,
    body
  });
}

console.log(`Validation finished: ${preparedEmails.length} of ${batch1Contacts.length} passed.`);
if (!allPassed) {
  console.error('Safety verification failed. Halting.');
  process.exit(1);
}

// Check for --execute flag
const isExecute = process.argv.includes('--execute');

if (!isExecute) {
  console.log('\n[DRY RUN MODE ONLY] Run with --execute after user approval to perform live dispatch via Mail.app.');
  console.log('Sample Prepared Email #1:');
  console.log(`TO: ${preparedEmails[0].recipient} <${preparedEmails[0].email}>`);
  console.log(`SUBJECT: ${preparedEmails[0].subject}\n`);
  console.log(preparedEmails[0].body);
  process.exit(0);
}

console.log(`\n🚀 STARTING LIVE OUTBOUND DISPATCH of ${preparedEmails.length} emails from ricomiller@gmail.com...\n`);

const results = [];
let successCount = 0;

for (let i = 0; i < preparedEmails.length; i++) {
  const item = preparedEmails[i];
  process.stdout.write(`[${i+1}/${preparedEmails.length}] Sending to ${item.recipient} (${item.ticker} - ${item.email})... `);
  
  const ok = sendEmailViaAppleMail(item.email, item.subject, item.body);
  if (ok) {
    console.log('✓ SENT');
    successCount++;
    registerSent(item.email, item.subject, item.ticker);
    results.push({ ...item, status: 'SENT', timestamp: new Date().toISOString() });
  } else {
    console.log('✗ FAILED');
    results.push({ ...item, status: 'FAILED', timestamp: new Date().toISOString() });
  }
  
  if (i < preparedEmails.length - 1) {
    console.log('   Waiting 35 seconds to respect Gmail anti-spam rate limits...');
    sleep(35000);
  }
}

console.log(`\nBatch 1 dispatch finished. Successfully sent: ${successCount} of ${preparedEmails.length}.`);

// Export run report to ~/Downloads
const reportFile = `/Users/ericmiller/Downloads/Batch_1_Gmail_Outreach_Dispatch_Report_${new Date().toISOString().slice(0, 10)}.md`;
let rpt = `# Asset Liberator — Batch 1 Outbound Dispatch Report\n`;
rpt += `**Date:** ${new Date().toISOString()}\n`;
rpt += `**Sender:** Eric Miller <ricomiller@gmail.com>\n`;
rpt += `**Successful Sends:** ${successCount} of ${preparedEmails.length}\n\n`;
rpt += `| # | Ticker | Company | Recipient | Title | Email | Status |\n`;
rpt += `| :-: | :---: | :--- | :--- | :--- | :--- | :-: |\n`;
results.forEach((r, idx) => {
  rpt += `| ${idx+1} | **${r.ticker}** | ${r.company} | **${r.recipient}** | ${r.title} | \`${r.email}\` | ${r.status === 'SENT' ? '🟢 SENT' : '🔴 FAILED'} |\n`;
});
fs.writeFileSync(reportFile, rpt, 'utf8');
console.log(`Audit report exported to: ${reportFile}`);
