// dispatch_batch_1_gmail.js — Dispatch Batch 1 Personalized Outreach via Apple Mail (ricomiller@gmail.com)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. ABSOLUTE HARDCODED SUPPRESSION LIST (Zero Exception)
const EMBARGOED_DOMAINS = new Set([
  'mcguirewoods.com',
  'gibsondunn.com',
  'whitleylawgroup.com',
  'whitley-llp.com',
  'whitleyllp.com'
]);

const EMBARGOED_EMAILS = new Set([
  'solder@mcguirewoods.com',
  'dfoley@mcguirewoods.com',
  'jkrause@gibsondunn.com',
  'firm@gibsondunn.com',
  'securities@gibsondunn.com',
  'mgibson@gibsondunn.com',
  'swhitley@whitleylawgroup.com',
  'swhitley@whitley-llp.com',
  'swhitley@whitleyllp.com'
]);


const BANNED_PATTERNS = [
  /^info([._-].*)?$/i,
  /^contact([._-].*)?$/i,
  /^restructur/i,
  /^support([._-].*)?$/i,
  /^legal([._-].*)?$/i,
  /^sales([._-].*)?$/i,
  /^admin([._-].*)?$/i,
  /^ir([._-].*)?$/i,
  /^investor/i,
  /^management([._-].*)?$/i,
  /^corp([._-].*)?$/i,
  /^team([._-].*)?$/i,
  /^help([._-].*)?$/i,
  /^billing([._-].*)?$/i,
  /^press([._-].*)?$/i,
  /^media([._-].*)?$/i,
  /^firm([._-].*)?$/i,
  /^office([._-].*)?$/i,
  /^general([._-].*)?$/i,
  /^inquir/i,
  /^hello([._-].*)?$/i,
  /^compliance([._-].*)?$/i,
  /^governance([._-].*)?$/i,
  /^secretary([._-].*)?$/i,
  /^cfo([._-].*)?$/i,
  /^ceo([._-].*)?$/i,
  /^coo([._-].*)?$/i,
  /^cto([._-].*)?$/i,
  /^clo([._-].*)?$/i,
  /^gc([._-].*)?$/i,
  /^cmo([._-].*)?$/i,
  /^cro([._-].*)?$/i,
  /^president([._-].*)?$/i,
  /^chair([._-].*)?$/i,
  /^board([._-].*)?$/i,
  /^director([._-].*)?$/i
];

function isGenericEmail(prefix) {
  return BANNED_PATTERNS.some(p => p.test(prefix));
}

const BANNED_PREFIXES = new Set([
  'info', 'contact', 'restructuring', 'support', 'legal', 'sales',
  'admin', 'ir', 'investor', 'investors', 'management', 'corp',
  'team', 'help', 'billing', 'press', 'media', 'firm', 'office',
  'general', 'inquiries', 'hello', 'cfo', 'ceo', 'coo', 'cto', 'clo', 'gc', 'cmo', 'cro', 'president', 'chair', 'board', 'director', 'directors'
]);

function validateSafetyGuard(email) {
  const clean = (email || '').trim().toLowerCase();
  if (!clean || !clean.includes('@')) return { ok: false, reason: 'Invalid email' };
  
  const [prefix, domain] = clean.split('@');
  
  if (EMBARGOED_DOMAINS.has(domain) || clean.includes('mcguirewoods')) {
    return { ok: false, reason: 'HARD EMBARGO: mcguirewoods.com domain permanently prohibited.' };
  }
  if (EMBARGOED_EMAILS.has(clean) || clean.includes('solder@')) {
    return { ok: false, reason: 'HARD EMBARGO: Stephen Older / suppressed address permanently prohibited.' };
  }
  if (BANNED_PREFIXES.has(prefix) || isGenericEmail(prefix)) {
    return { ok: false, reason: `GENERIC PREFIX BANNED: ${prefix}@` };
  }
  
  // Deduplication check
  try {
    const regPath = path.resolve(__dirname, '../data/dispatched_recipients_registry.json');
    if (fs.existsSync(regPath)) {
      const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
      if (reg.recipients && reg.recipients[clean]) {
        return { ok: false, reason: `ALREADY SENT: ${clean} was previously contacted on ${reg.recipients[clean].lastSent}` };
      }
    }
  } catch (err) {
    console.error('Error checking registry:', err.message);
  }
  
  return { ok: true };
}

function sendEmailViaAppleMail(to, subject, body) {
  const guard = validateSafetyGuard(to);
  if (!guard.ok) {
    console.log(`❌ [GUARD BLOCKED] ${to}: ${guard.reason}`);
    return false;
  }

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
    execSync('osascript', { input: appleScript, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return true;
  } catch (err) {
    console.error(`❌ Transmission error for ${to}:`, err.message);
    return false;
  }
}

function registerSent(to, subject, ticker) {
  try {
    const regPath = path.resolve(__dirname, '../data/dispatched_recipients_registry.json');
    let regData = { updatedAt: new Date().toISOString(), recipients: {} };
    if (fs.existsSync(regPath)) {
      regData = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    }
    if (!regData.recipients) regData.recipients = {};

    const clean = to.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    if (!regData.recipients[clean]) {
      regData.recipients[clean] = {
        email: clean,
        firstSent: today,
        lastSent: today,
        count: 1,
        ticker: ticker || 'UNKNOWN',
        subjects: [subject]
      };
    } else {
      regData.recipients[clean].lastSent = today;
      regData.recipients[clean].count++;
      if (!regData.recipients[clean].subjects.includes(subject)) {
        regData.recipients[clean].subjects.push(subject);
      }
    }
    regData.totalUniqueRecipients = Object.keys(regData.recipients).length;
    regData.updatedAt = new Date().toISOString();
    fs.writeFileSync(regPath, JSON.stringify(regData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error logging sent registry:', err.message);
  }
}

function sleep(ms) {
  const secs = Math.max(1, Math.ceil(ms / 1000));
  try { execSync(`sleep ${secs}`); } catch (e) {}
}

module.exports = {
  validateSafetyGuard,
  sendEmailViaAppleMail,
  registerSent,
  sleep
};
