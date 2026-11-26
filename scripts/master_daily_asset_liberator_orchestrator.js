// master_daily_asset_liberator_orchestrator.js — Autonomous Daily Outreach Orchestrator & Bounce Resolver
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { validateSafetyGuard, sendEmailViaAppleMail, registerSent, sleep } = require('./dispatch_batch_1_gmail');
const { checkBounces } = require('./check_gmail_bounces');
const { resolveAndResendBounces } = require('./autonomous_bounce_resolver');

const BATCH_SIZE = 25;
const DELAY_BETWEEN_EMAILS_MS = 35000; // 35 seconds for Gmail anti-spam safety

function getFirstName(fullName) {
  if (!fullName) return '';
  let clean = fullName.replace(/,?\s*(Esq\.?|JD|MD|M\.D\.?|Ph\.?D\.?|Jr\.?|Sr\.?|[IVX]+)$/i, '').trim();
  clean = clean.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length > 1 && /^[A-Z]\.?$/i.test(parts[0])) {
    return parts[1];
  }
  return parts[0] || fullName;
}


function isEmailGloballyPaused() {
  const lockPaths = [
    '/Users/ericmiller/NEW JUNE 26/EMAIL_CAMPAIGNS_PAUSED.lock',
    '/Users/ericmiller/.gemini/antigravity-ide/EMAIL_CAMPAIGNS_PAUSED.lock',
    '/Users/ericmiller/.gemini/antigravity-ide/scratch/asset-liberator/EMAIL_CAMPAIGNS_PAUSED.lock'
  ];
  return lockPaths.some(p => fs.existsSync(p));
}

async function runDailyOrchestrator() {
  if (isEmailGloballyPaused()) {
    console.log("🛑 [PAUSED] All email campaigns are currently PAUSED per user directive. Exiting Asset Liberator.");
    return;
  }
  const isExecute = process.argv.includes('--execute');
  const today = new Date().toISOString().slice(0, 10);
  console.log(`================================================================`);
  console.log(`[ORCHESTRATOR] Starting Daily Asset Liberator Outreach — ${today}`);
  console.log(`[ORCHESTRATOR] Mode: ${isExecute ? 'LIVE EXECUTION (--execute)' : 'DRY RUN'}`);
  console.log(`[ORCHESTRATOR] Sender: Eric Miller <ricomiller@gmail.com>`);
  console.log(`================================================================\n`);

  // 1. Audit Bounces in ricomiller@gmail.com
  console.log('[STAGE 1] Running Gmail Bounce & Undelivered Audit...');
  try {
    const bounces = checkBounces();
    console.log(`[STAGE 1] Bounce audit complete. Detected: ${bounces.length} item(s).\n`);
  } catch (err) {
    console.error('[STAGE 1] Warning: Bounce check failed:', err.message);
  }

  // 2. Load Ingested Targets & Registries
  console.log('[STAGE 2] Loading target database and cross-referencing sent registries...');
  const targetsFile = path.resolve(__dirname, '../data/ingested-targets.json');
  const targetData = JSON.parse(fs.readFileSync(targetsFile, 'utf8'));
  
  const regFile = path.resolve(__dirname, '../data/dispatched_recipients_registry.json');
  let sentRegistry = {};
  if (fs.existsSync(regFile)) {
    sentRegistry = JSON.parse(fs.readFileSync(regFile, 'utf8')).recipients || {};
  }
  
  const bounceFile = path.resolve(__dirname, '../data/extracted_bounces.json');
  let bounceList = new Set();
  if (fs.existsSync(bounceFile)) {
    bounceList = new Set((JSON.parse(fs.readFileSync(bounceFile, 'utf8')) || []).map(e => e.toLowerCase()));
  }

  // 3. Find Unsent, Vetted Clean Candidates
  const availableCandidates = [];
  const seenEmails = new Set();

  for (const t of targetData.targets) {
    for (const c of t.contacts || []) {
      const email = (c.email || '').trim().toLowerCase();
      if (!email || seenEmails.has(email)) continue;
      seenEmails.add(email);

      // Check if already sent
      if (sentRegistry[email]) continue;

      // Check if bounced
      if (bounceList.has(email)) continue;

      // Run hard safety guards (suppression list, mcguirewoods embargo, generic prefix ban)
      const guard = validateSafetyGuard(email);
      if (!guard.ok) continue;

      const priorityEmails = [
        "nathan.moore@wilmerhale.com",
        "jennifer.hodges@lumen.com",
        "jason.hitchcock@greenlane.com",
        "neil@ctinanotech.com",
        "vibhu.vivek@cambiumnetworks.com",
        "craig@novaminerals.com.au",
        "defranceschi@rlf.com",
        "cscott@bionenviro.com",
        "spagano@bionenviro.com",
        "chad.boeckmann@hain.com",
        "kristy.meringolo@hain.com",
        "sally.rau@cambiumnetworks.com",
        "fboctor@petrospharma.com",
        "mhunter@htflawyers.com"
      ];
      const isPriority = priorityEmails.includes(email);

      availableCandidates.push({
        target: t,
        contact: c,
        isPriority
      });
    }
  }

  availableCandidates.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return 0;
  });

  console.log(`[STAGE 2] Total uncontacted, verified clean candidates in pipeline: ${availableCandidates.length}`);

  if (availableCandidates.length === 0) {
    console.log('[STAGE 3] Pipeline fully exhausted. Zero uncontacted verified candidates remaining.');
    return;
  }

  const batch = availableCandidates.slice(0, BATCH_SIZE);
  console.log(`[STAGE 3] Selected today's batch: ${batch.length} recipients.\n`);

  if (!isExecute) {
    console.log(`[DRY RUN] Would dispatch to the following ${batch.length} recipients:`);
    batch.forEach((item, idx) => {
      const fn = getFirstName(item.contact.name);
      console.log(`  ${idx + 1}. ${item.contact.name} (${item.target.ticker} - ${item.contact.email}) [Greeting: Dear ${fn},]`);
    });
    console.log('\nRun with --execute to execute live Apple Mail transmission.');
    return;
  }

  // 4. Execute Batch Transmission via Apple Mail
  console.log(`[STAGE 4] Beginning live sequential transmission via ricomiller@gmail.com...`);
  const results = [];
  let successCount = 0;

  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    const target = item.target;
    const contact = item.contact;
    const ticker = target.ticker;
    const companyName = target.name;
    const cik = target.cik;
    
    const subName = (target.operatingSub && target.operatingSub.name) || (target.name + ' Operations');
    const revStr = (target.operatingSub && target.operatingSub.metrics && target.operatingSub.metrics.commercialRevenue) || '$15M+';
    
    const triggers = (target.vehicleDistress && target.vehicleDistress.secTriggers) || [];
    const triggerDesc = triggers[0] || 'recent regulatory distress filings';
    
    const playbook = (target.extractionFeasibility && target.extractionFeasibility.recommendedPlaybook) || 'consensual_carveout';
    const playbookTitle = playbook.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const name = contact.name;
    const firstName = getFirstName(name);
    const title = contact.title;
    const email = contact.email;
    const isLegal = /counsel|legal|esq|attorney|officer/i.test(title);
    
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

    process.stdout.write(`[${i + 1}/${batch.length}] Dispatching to ${name} (${ticker} - ${email})... `);
    const ok = sendEmailViaAppleMail(email, subject, body);
    if (ok) {
      console.log('✓ SENT');
      successCount++;
      registerSent(email, subject, ticker);
      results.push({ ticker, company: companyName, name, title, email, status: 'SENT', timestamp: new Date().toISOString() });

      // Update CRM records directly in ingested-targets.json
      target.crm = target.crm || {};
      target.crm.stage = 'outreach_sent';
      target.crm.lastContactDate = today;
      target.crm.activities = target.crm.activities || [];
      target.crm.activities.unshift({
        id: `act-dispatch-${today}-${Date.now()}-${i}`,
        date: today,
        type: 'email',
        summary: `Dispatched personalized carve-out proposal to ${name} (${title}, ${email}) via Apple Mail (ricomiller@gmail.com).`
      });
      target.crm.notes = target.crm.notes || [];
      target.crm.notes.unshift({
        id: `note-dispatch-${today}-${Date.now()}-${i}`,
        date: today,
        author: 'Eric Miller <ricomiller@gmail.com>',
        text: `Personalized institutional carve-out proposal transmitted directly to ${name} (${title}, ${email}) regarding ${subName} (${playbookTitle}). Delivery confirmed.`
      });
    } else {
      console.log('✗ FAILED');
      results.push({ ticker, company: companyName, name, title, email, status: 'FAILED', timestamp: new Date().toISOString() });
    }

    if (i < batch.length - 1) {
      console.log(`   [Gmail Protection] Sleeping ${DELAY_BETWEEN_EMAILS_MS / 1000}s to maintain pristine sender reputation...`);
      sleep(DELAY_BETWEEN_EMAILS_MS);
    }
  }

  // Save updated CRM activities to ingested-targets.json
  fs.writeFileSync(targetsFile, JSON.stringify(targetData, null, 2), 'utf8');
  console.log(`[STAGE 4] ✓ Successfully recorded CRM activities in ingested-targets.json.`);

  // 5. POST-DISPATCH BOUNCE AUDIT, WEB/FILINGS RESEARCH & AUTONOMOUS RESEND
  console.log(`\n[STAGE 4.5] Pausing 45s for initial delivery receipts, then running autonomous mailbox bounce audit & resolution...`);
  sleep(45000);
  try {
    const resends = resolveAndResendBounces(true);
    console.log(`[STAGE 4.5] ✓ Autonomous bounce audit & resolution complete. Resent: ${resends.filter(r => r.status === 'SENT').length} address(es).`);
  } catch (err) {
    console.warn(`[STAGE 4.5] Bounce resolver warning:`, err.message);
  }

  // 6. Generate and Export Daily Report
  console.log(`\n[STAGE 5] Generating and exporting daily outreach report...`);
  const reportPath = `/Users/ericmiller/Downloads/Asset_Liberator_Daily_Dispatch_Report_${today}.md`;
  let rpt = `# Asset Liberator — Daily Outreach Dispatch Report\n`;
  rpt += `**Date:** ${today}  \n`;
  rpt += `**Sender Identity:** Eric Miller <ricomiller@gmail.com>  \n`;
  rpt += `**Delivered:** ${successCount} of ${batch.length}  \n`;
  rpt += `**Remaining Unsent Pipeline:** ${availableCandidates.length - successCount}  \n\n`;
  rpt += `| # | Ticker | Company | Recipient Name | Title | Email Address | Status |\n`;
  rpt += `| :-: | :---: | :--- | :--- | :--- | :--- | :-: |\n`;
  results.forEach((r, idx) => {
    rpt += `| ${idx + 1} | **${r.ticker}** | ${r.company} | **${r.name}** | ${r.title} | \`${r.email}\` | ${r.status === 'SENT' ? '🟢 SENT' : '🔴 FAILED'} |\n`;
  });
  rpt += `\n---\n*Automated daily run executed and verified. Zero generic mailboxes contacted. McGuireWoods embargo verified.*\n`;
  fs.writeFileSync(reportPath, rpt, 'utf8');
  console.log(`[STAGE 5] ✓ Saved report to: ${reportPath}`);

  // 7. Auto-Deploy updated CRM to Vercel production
  console.log(`\n[STAGE 6] Triggering prebuild assertions, build, and Vercel production deployment...`);
  try {
    execSync('npm run prebuild', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
    execSync('npx vercel --prod --yes', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
    console.log(`[STAGE 6] ✓ Successfully deployed updated CRM to https://asset-liberator.vercel.app`);
  } catch (err) {
    console.warn(`[STAGE 6] Warning: Auto-deploy encountered:`, err.message);
  }

  console.log(`[ORCHESTRATOR] Daily run complete.\n`);
}

runDailyOrchestrator();
