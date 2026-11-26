// check_gmail_bounces.js — Monitor ricomiller@gmail.com for undelivered / bounce notifications
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const START_TIMESTAMP = new Date('2026-10-14T09:59:00-07:00');

function checkBounces() {
  console.log(`[BounceAuditor] Scanning ricomiller@gmail.com for delivery failures since ${START_TIMESTAMP.toISOString()}...`);
  
  const appleScript = `tell application "Mail"
  set b to first mailbox of account "ricomiller@gmail.com" whose name is "INBOX"
  set failList to {}
  set totalMsgs to count of messages of b
  set checkLimit to 50
  if totalMsgs < checkLimit then set checkLimit to totalMsgs
  set recentMsgs to messages 1 thru checkLimit of b
  repeat with m in recentMsgs
    try
      set sub to subject of m
      set sdr to sender of m
      if (sub contains "Delivery Status" or sub contains "Undelivered" or sub contains "failed" or sub contains "failure" or sdr contains "mailer-daemon" or sdr contains "postmaster") then
        set dt to date received of m as string
        set cnt to all headers of m
        set end of failList to (sub & "|||" & dt & "|||" & cnt)
      end if
    end try
  end repeat
  set AppleScript's text item delimiters to "###MSG_DELIM###"
  return failList as text
end tell`;

  let output = '';
  try {
    output = execSync('osascript', { input: appleScript, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch (err) {
    console.error('[BounceAuditor] AppleScript error:', err.message);
    return [];
  }

  if (!output || !output.trim()) {
    console.log('[BounceAuditor] ✓ No delivery failure messages found in recent Gmail INBOX.');
    return [];
  }

  const rawMessages = output.trim().split('###MSG_DELIM###');
  console.log(`[BounceAuditor] Found ${rawMessages.length} delivery notification candidate(s).`);

  const detectedBounces = [];
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

  for (const raw of rawMessages) {
    const parts = raw.split('|||');
    if (parts.length < 3) continue;
    const subject = parts[0];
    const dateStr = parts[1];
    const content = parts[2];

    const msgDate = new Date(dateStr);
    if (!isNaN(msgDate.getTime()) && msgDate < START_TIMESTAMP) {
      continue;
    }

    const matches = content.match(emailRegex) || [];
    for (const em of matches) {
      const clean = em.toLowerCase();
      if (!clean.includes('google') && !clean.includes('mailer-daemon') && !clean.includes('ricomiller') && !clean.includes('postmaster')) {
        detectedBounces.push({
          email: clean,
          subject,
          date: dateStr,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  const bounceFile = path.resolve(__dirname, '../data/extracted_bounces.json');
  let existingBounces = [];
  if (fs.existsSync(bounceFile)) {
    try {
      existingBounces = JSON.parse(fs.readFileSync(bounceFile, 'utf8'));
    } catch (e) {}
  }

  let updated = false;
  for (const b of detectedBounces) {
    if (!existingBounces.includes(b.email)) {
      existingBounces.push(b.email);
      console.log(`[BounceAuditor] ⚠️ NEW BOUNCE LOGGED: ${b.email}`);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(bounceFile, JSON.stringify(existingBounces, null, 2), 'utf8');
    console.log(`[BounceAuditor] Updated ${bounceFile} with ${existingBounces.length} total bounces.`);
  } else {
    console.log('[BounceAuditor] Zero new bounces detected since inception.');
  }

  return detectedBounces;
}

if (require.main === module) {
  checkBounces();
}

module.exports = { checkBounces };
