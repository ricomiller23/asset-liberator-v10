const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getBounceDetails() {
  const appleScript = `tell application "Mail"
  set b to first mailbox of account "ricomiller@gmail.com" whose name is "INBOX"
  set checkLimit to 30
  set totalMsgs to count of messages of b
  if totalMsgs < checkLimit then set checkLimit to totalMsgs
  set recentMsgs to messages 1 thru checkLimit of b
  set outList to {}
  repeat with m in recentMsgs
    try
      set sub to subject of m
      set sdr to sender of m
      if (sub contains "Delivery Status" or sub contains "Undeliverable" or sub contains "failed" or sub contains "failure" or sdr contains "mailer-daemon" or sdr contains "postmaster") then
        set dt to date received of m as string
        set cnt to all headers of m
        set end of outList to (sub & "---SEP---" & dt & "---SEP---" & cnt)
      end if
    end try
  end repeat
  set AppleScript's text item delimiters to "###END_OF_MSG###"
  return outList as text
end tell`;

  let raw = '';
  try {
    raw = execSync('osascript', { input: appleScript, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  } catch (err) {
    console.error('AppleScript error:', err.message);
    return [];
  }

  if (!raw.trim()) return [];

  const rawItems = raw.split('###END_OF_MSG###');
  const bounces = [];

  for (const item of rawItems) {
    const parts = item.split('---SEP---');
    if (parts.length < 3) continue;
    const sub = parts[0].trim();
    const dt = parts[1].trim();
    const cnt = parts[2];

    // Extract failed recipient
    let failedRecipient = null;
    let match = cnt.match(/Final-Recipient:\s*rfc822;\s*([^\s\r\n;]+)/i);
    if (match) {
      failedRecipient = match[1].toLowerCase().trim();
    } else {
      match = cnt.match(/Your message to\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\s+has been blocked/i);
      if (match) {
        failedRecipient = match[1].toLowerCase().trim();
      } else {
        match = cnt.match(/To:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
        if (match && !match[1].includes('ricomiller') && !match[1].includes('mailer-daemon')) {
          failedRecipient = match[1].toLowerCase().trim();
        }
      }
    }

    // Extract diagnostic code / reason
    let reason = '';
    const diagMatch = cnt.match(/Diagnostic-Code:[^\r\n]*[\r\n]+(?:\s+[^\r\n]+)*/i) ||
                      cnt.match(/The response from the remote server was:[^\r\n]*[\r\n]+(?:\s+[^\r\n]+)*/i) ||
                      cnt.match(/550\s+[^\r\n]+/i);
    if (diagMatch) {
      reason = diagMatch[0].replace(/\s+/g, ' ').slice(0, 200).trim();
    }

    if (failedRecipient) {
      bounces.push({
        recipient: failedRecipient,
        date: dt,
        subject: sub,
        reason: reason || 'Delivery Failed'
      });
    }
  }

  return bounces;
}

const bounces = getBounceDetails();
console.log(JSON.stringify(bounces, null, 2));
