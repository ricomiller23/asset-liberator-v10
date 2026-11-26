// dispatch_oct16_verified_replacements.js — Autonomous Dispatch of Researched & Verified Replacements
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  {
    ticker: 'RNAZ',
    company: 'Transcode Therapeutics, Inc.',
    to: 'mbison@goodwinlaw.com',
    recipientName: 'Michael H. Bison, Esq.',
    title: 'Partner, Outside SEC Legal Counsel (Goodwin Procter LLP)',
    subject: 'CONFIDENTIAL: TransCode Therapeutics (RNAZ) — Subsidiary Carve-Out & Patent Recapitalization Proposal (Attn: Michael Bison, Esq.)',
    body: `Dear Mr. Bison,

I hope this message finds you well. I am reaching out to you directly in your capacity as designated outside securities and corporate counsel at Goodwin Procter LLP representing TransCode Therapeutics, Inc. (CIK: 0001859818).

We represent a life sciences special situations investment vehicle focused on clinical biotechnology patent rollups, delivery mechanism intellectual property, and distressed public company recapitalizations. Having evaluated TransCode's TTX-MC138 oligonucleotide platform, microRNA oncology pipeline, and capital structure, we have structured a consensual proposal to provide dedicated clinical development funding while resolving historical liabilities.

Given Goodwin Procter's representation of TransCode in its SEC periodic reporting and capital market matters, we would welcome an opportunity to coordinate with your team regarding transaction structure, regulatory filings, and corporate execution under mutual NDA.

We would appreciate your assistance in presenting this framework to CEO Dr. Philippe Calais and the Board, or scheduling a brief introductory discussion.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'RNAZ',
    company: 'Transcode Therapeutics, Inc.',
    to: 'zmedarova@mgh.harvard.edu',
    recipientName: 'Zdravka Medarova, Ph.D.',
    title: 'Scientific Co-Founder & Assoc. Prof. of Radiology (Harvard / MGH)',
    subject: 'CONFIDENTIAL / RESEARCH COLLABORATION: TransCode Therapeutics (RNAZ) — Dedicated Clinical Development Capital & Patent Recapitalization',
    body: `Dear Dr. Medarova,

I hope this message finds you well. I am writing to you directly as Scientific Co-Founder and pioneer of TransCode Therapeutics' iron oxide nanoparticle and non-coding RNA delivery technology.

Our life sciences special situations syndicate provides dedicated clinical development capital for distressed clinical-stage biotechnology assets. We have evaluated the proprietary delivery mechanism underlying TTX-MC138 and related oncology assets, and have formulated a consensual restructuring and carve-out proposal to ensure unencumbered, continuous clinical funding for the portfolio.

Given your leadership over the platform's scientific architecture at Harvard/MGH and TransCode, we would welcome the opportunity to discuss the proposed capital injection and clinical asset stewardship under mutual NDA.

Please let us know your availability for a brief conversation this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'BTLN',
    company: 'Brightline Interactive, Inc.',
    to: 'cmurillo@hselaw.com',
    recipientName: 'C. Christopher Murillo, Esq.',
    title: 'Partner, Capital Markets & SEC Counsel (Harter Secrest & Emery LLP)',
    subject: 'CONFIDENTIAL / FOR TRANSMISSION TO BOARD: Brightline Interactive, Inc. (BTLN) — Consensual Carveout / Restructuring Framework (Attn: Christopher Murillo, Esq.)',
    body: `Dear Mr. Murillo,

I hope this message finds you well. I am reaching out to you in your capacity as lead outside corporate and securities counsel at Harter Secrest & Emery LLP representing Brightline Interactive, Inc. (CIK: 0001853874, Nasdaq: BTLN).

Our special situations investment desk specializes in consensual subsidiary carve-outs, recapitalizations, and balance sheet restructuring for publicly traded technology companies. Following Brightline Interactive's recent corporate rebrand and restructuring, we have structured an asset-level carve-out and capital solution designed to inject immediate non-dilutive liquidity while eliminating corporate overhang.

Given your representation of Brightline Interactive in its SEC Form 10-K disclosures and securities matters, we would welcome an opportunity to coordinate with your team regarding transaction structure, regulatory filings, and board execution under mutual NDA.

Please let us know your availability for a brief introductory discussion.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'BTLN',
    company: 'Brightline Interactive, Inc.',
    to: 'tyler@brightlineinteractive.com',
    recipientName: 'Tyler Gates',
    title: 'Chief Executive Officer (Brightline Interactive)',
    subject: 'CONFIDENTIAL: Brightline Interactive (BTLN) — Dedicated Growth Capital & Subsidiary Recapitalization Proposal',
    body: `Dear Tyler,

I hope this message finds you well. I am reaching out to you directly in your capacity as Chief Executive Officer of Brightline Interactive, Inc. (Nasdaq: BTLN).

Our special situations investment vehicle specializes in dedicated growth capital, asset carve-outs, and consensual balance sheet restructuring for enterprise immersive technology and spatial computing companies. Having evaluated Brightline's simulation contracts, digital twin deployments, and public market valuation, we have developed a structured capital framework designed to provide operational runway and recapitalize key technology subsidiaries.

We would welcome an opportunity to schedule a brief introductory discussion with you and CFO William Keneally under mutual NDA.

Please let us know your availability this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'IPEX',
    company: 'Inflection Point Acquisition Corp. V',
    to: 'joel.rubinstein@whitecase.com',
    recipientName: 'Joel L. Rubinstein, Esq.',
    title: 'Partner & Lead Capital Markets Counsel (White & Case LLP)',
    subject: 'CONFIDENTIAL: Inflection Point Acquisition (IPEX) — Special Situations Carve-Out Capital & Sponsor Alignment Framework',
    body: `Dear Mr. Rubinstein,

I hope this message finds you well. I am reaching out to you in your capacity as lead capital markets and special situations counsel at White & Case LLP representing Inflection Point Acquisition Corp. (CIK: 0001955310, Nasdaq: IPEX) and Kingstown Capital Management.

Our investment desk specializes in structured carve-outs, corporate restructurings, and pre-packaged target asset contributions. We have structured a transaction framework tailored for the Inflection Point platform to pair unencumbered, cash-generative technology operating subsidiaries with sponsor capital structures under consensual terms.

Given your long-standing representation of Michael Blitzer and the Inflection Point vehicles in their SEC registration statements and business combinations, we would welcome the opportunity to share our transaction architecture with your team under mutual NDA.

Please let us know your availability for a brief discussion this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'TBPH',
    company: 'Theravance Biopharma, Inc.',
    to: 'bgrimaud@theravance.com',
    recipientName: 'Brett A. Grimaud, Esq.',
    title: 'Senior Vice President, General Counsel & Secretary',
    subject: 'CONFIDENTIAL: Theravance Biopharma (TBPH) — Post-Merger Subsidiary Asset Monetization & Commercial Portfolio Framework',
    body: `Dear Mr. Grimaud,

I hope this message finds you well. I am writing to you directly in your capacity as Senior Vice President, General Counsel, and Corporate Secretary of Theravance Biopharma, Inc. (CIK: 0001583107).

Following the recent completion of Theravance's strategic merger with Zymeworks Inc., our special situations investment syndicate is actively evaluating commercial respiratory and clinical-stage development assets. We structure non-dilutive asset carve-outs, royalty monetizations, and secondary development vehicles that provide immediate liquidity while optimizing resource allocation across post-merger portfolios.

We would welcome an opportunity to discuss our proposed structuring framework with your legal and corporate development team under mutual NDA.

Please let us know your availability for a brief discussion this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  },
  {
    ticker: 'TBPH',
    company: 'Theravance Biopharma, Inc.',
    to: 'rfarnum@theravance.com',
    recipientName: 'Rhonda F. Farnum',
    title: 'Chief Business Officer & Senior Vice President of Commercial Affairs',
    subject: 'CONFIDENTIAL: Theravance Biopharma (TBPH) — Commercial Asset Monetization & Dedicated Capital Framework',
    body: `Dear Rhonda,

I hope this message finds you well. I am reaching out to you directly in your capacity as Chief Business Officer and Senior Vice President of Commercial Affairs at Theravance Biopharma, Inc.

Our special situations investment desk specializes in structured asset carve-outs and commercialization capital for biopharmaceutical portfolios. In light of the recent corporate integration with Zymeworks Inc., we have outlined a tailored monetization and secondary operating structure for Theravance's non-core clinical and commercial assets designed to maximize enterprise value.

We would welcome an opportunity to schedule a brief introductory discussion to present this framework to you under mutual NDA.

Please let us know what time works best for a conversation this week.

Sincerely,

Eric Miller
Managing Principal
Special Situations & Carve-Out Restructuring Desk
Direct: (480) 287-2227
ricomiller@icloud.com`
  }
];

// Safety Guard Check
function validateSafety(to) {
  const clean = (to || '').trim().toLowerCase();
  const domain = clean.includes('@') ? clean.split('@')[1] : '';

  const EMBARGOED_DOMAINS = new Set([
    'mcguirewoods.com',
    'gibsondunn.com',
    'whitleylawgroup.com',
    'whitley-llp.com',
    'whitleyllp.com'
  ]);
  if (EMBARGOED_DOMAINS.has(domain)) {
    return { ok: false, reason: `EMBARGOED DOMAIN: ${domain}` };
  }

  const suppPath = path.resolve(__dirname, '../data/suppression_list.json');
  if (fs.existsSync(suppPath)) {
    const supp = JSON.parse(fs.readFileSync(suppPath, 'utf8'));
    if ((supp.suppressedEmails || []).map(e => e.toLowerCase()).includes(clean)) {
      return { ok: false, reason: `SUPPRESSION LIST MATCH: ${clean}` };
    }
  }

  const regPath = path.resolve(__dirname, '../data/dispatched_recipients_registry.json');
  if (fs.existsSync(regPath)) {
    const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    if (reg.recipients && reg.recipients[clean]) {
      return { ok: false, reason: `ALREADY DISPATCHED: ${clean}` };
    }
  }

  return { ok: true };
}

function sendViaAppleMail(to, subject, body) {
  const escapedSubject = subject.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const escapedBody = body.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const appleScript = `tell application "Mail"
  set newMsg to make new outgoing message with properties {sender:"Eric Miller <ricomiller@gmail.com>", subject:"${escapedSubject}", content:"${escapedBody}", visible:false}
  tell newMsg
    make new to recipient at end of to recipients with properties {address:"${to}"}
    send
  end tell
end tell`;

  try {
    execSync('osascript', { input: appleScript, encoding: 'utf8', timeout: 30000 });
    return true;
  } catch (err) {
    console.error(`❌ Transmission error for ${to}:`, err.message);
    return false;
  }
}

function registerSent(to, subject, ticker) {
  const regPath = path.resolve(__dirname, '../data/dispatched_recipients_registry.json');
  let regData = { updatedAt: new Date().toISOString(), recipients: {} };
  if (fs.existsSync(regPath)) {
    regData = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  }
  if (!regData.recipients) regData.recipients = {};

  const clean = to.trim().toLowerCase();
  const today = '2026-10-16';
  regData.recipients[clean] = {
    email: clean,
    firstSent: today,
    lastSent: today,
    count: 1,
    ticker: ticker || 'UNKNOWN',
    subjects: [subject]
  };
  regData.totalUniqueRecipients = Object.keys(regData.recipients).length;
  regData.updatedAt = new Date().toISOString();
  fs.writeFileSync(regPath, JSON.stringify(regData, null, 2));
}

function updateTargetsCRM(targetUpdates) {
  const targetsPath = path.resolve(__dirname, '../data/ingested-targets.json');
  if (!fs.existsSync(targetsPath)) return;
  const data = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
  const targets = data.targets || [];

  for (const upd of targetUpdates) {
    const t = targets.find(item => item.ticker === upd.ticker);
    if (!t) continue;
    if (!t.contacts) t.contacts = [];
    
    // Add contact if not present
    const existing = t.contacts.find(c => c.email && c.email.toLowerCase() === upd.to.toLowerCase());
    if (!existing) {
      t.contacts.push({
        id: `c-${upd.ticker.toLowerCase()}-verified-${Date.now()}`,
        name: upd.recipientName,
        title: upd.title,
        entity: 'Verified Decision Maker / Legal Counsel',
        email: upd.to,
        phone: '(480) 287-2227',
        roleSummary: `Verified direct replacement contact sourced via SEC filings/bar directory. Outbound proposal dispatched Oct 16, 2026.`,
        receptivityScore: 'very_high'
      });
    }

    if (!t.crm) t.crm = { activities: [], notes: [] };
    if (!t.crm.activities) t.crm.activities = [];
    t.crm.activities.unshift({
      id: `act-replacement-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: '2026-10-16',
      type: 'email',
      summary: `Dispatched verified replacement proposal to ${upd.recipientName} (${upd.title}) at ${upd.to} via Apple Mail.`
    });
  }

  data.targets = targets;
  fs.writeFileSync(targetsPath, JSON.stringify(data, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('================================================================');
  console.log('[ReplacementDispatcher] Initiating Verified Replacement Outreach');
  console.log('================================================================\n');

  const dispatched = [];

  for (let i = 0; i < REPLACEMENTS.length; i++) {
    const item = REPLACEMENTS[i];
    console.log(`[${i + 1}/${REPLACEMENTS.length}] Processing ${item.recipientName} (${item.ticker} - ${item.to})...`);

    const guard = validateSafety(item.to);
    if (!guard.ok) {
      console.log(`   ❌ [BLOCKED] ${guard.reason}`);
      continue;
    }

    console.log(`   Dispatching via Apple Mail...`);
    const sent = sendViaAppleMail(item.to, item.subject, item.body);
    if (sent) {
      console.log(`   ✓ SENT SUCCESSFULLY`);
      registerSent(item.to, item.subject, item.ticker);
      dispatched.push(item);
    } else {
      console.log(`   ❌ FAILED TO SEND`);
    }

    if (i < REPLACEMENTS.length - 1) {
      console.log('   [Gmail Protection] Sleeping 15s to preserve pristine sender reputation...\n');
      await sleep(15000);
    }
  }

  console.log(`\n================================================================`);
  console.log(`[ReplacementDispatcher] Dispatch Complete: ${dispatched.length} of ${REPLACEMENTS.length} Sent.`);
  console.log(`================================================================\n`);

  if (dispatched.length > 0) {
    console.log('Updating CRM activities in data/ingested-targets.json...');
    updateTargetsCRM(dispatched);
    console.log('✓ Ingested targets CRM updated.');
  }
}

run().catch(err => {
  console.error('Fatal error in dispatcher:', err);
  process.exit(1);
});
