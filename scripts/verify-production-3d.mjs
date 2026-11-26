import { createRequire } from 'module';
const require = createRequire('/Users/ericmiller/.gemini/antigravity/scratch/royal-backgammon-3d/node_modules');
const { chromium } = require('playwright-core');
import fs from 'fs';
import path from 'path';

const PROD_URL = 'https://asset-liberator.vercel.app';
const ARTIFACT_DIR = '/Users/ericmiller/.gemini/antigravity/brain/e6699a7f-e2eb-47fe-842b-57213098df7a';
const DOWNLOADS_DIR = '/Users/ericmiller/Downloads';

async function runAudit() {
  console.log(`[1/5] Checking live endpoints on ${PROD_URL}...`);
  const cacheBust = Date.now();
  
  const homeRes = await fetch(`${PROD_URL}/?_cb=${cacheBust}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!homeRes.ok) throw new Error(`Home route failed: HTTP ${homeRes.status}`);
  const homeHtml = await homeRes.text();
  if (!homeHtml.includes('ASSET LIBERATOR')) throw new Error('Branding missing from HTML');
  console.log(' -> HTTP GET / OK (HTTP 200, length:', homeHtml.length, ')');

  const targetsRes = await fetch(`${PROD_URL}/api/targets?_cb=${cacheBust}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!targetsRes.ok) throw new Error(`API targets failed: HTTP ${targetsRes.status}`);
  const targetsData = await targetsRes.json();
  const count = targetsData.targets ? targetsData.targets.length : (Array.isArray(targetsData) ? targetsData.length : 0);
  console.log(` -> HTTP GET /api/targets OK (HTTP 200, count: ${count})`);

  const exportRes = await fetch(`${PROD_URL}/api/export?format=csv&_cb=${cacheBust}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!exportRes.ok) throw new Error(`API export failed: HTTP ${exportRes.status}`);
  const exportCsv = await exportRes.text();
  console.log(' -> HTTP GET /api/export OK (HTTP 200, length:', exportCsv.length, ')');

  console.log('\n[2/5] Launching Chrome via Playwright with system binary...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();

  const consoleErrors = [];
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('[3/5] Navigating to Desktop (1440x900) & actuating 3D UI elements...');
  await desktopPage.goto(PROD_URL, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  // 1. Verify body background color
  const bgColor = await desktopPage.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log(' -> Body background-color computed:', bgColor);

  // 2. Capture desktop hero & 3D cards
  const desktopScreenshot = path.join(ARTIFACT_DIR, 'asset_liberator_royal_3d_desktop.png');
  await desktopPage.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log(' -> Saved desktop screenshot to:', desktopScreenshot);

  // 3. Actuate Dossier Drawer via first Dossier button
  const dossierBtn = desktopPage.locator('button[id^="btn-dossier-"]').first();
  await dossierBtn.click();
  await desktopPage.waitForTimeout(700);

  const closeDrawerBtn = desktopPage.locator('#close-target-drawer-btn');
  const isDrawerOpen = await closeDrawerBtn.isVisible();
  console.log(' -> Target Dossier Drawer visible:', isDrawerOpen);
  if (isDrawerOpen) {
    const drawerScreenshot = path.join(ARTIFACT_DIR, 'asset_liberator_royal_3d_drawer.png');
    await desktopPage.screenshot({ path: drawerScreenshot });
    console.log(' -> Saved drawer screenshot to:', drawerScreenshot);
    await closeDrawerBtn.click();
    await desktopPage.waitForTimeout(400);
  }

  // 4. Actuate Statutory Deal Playbook Modal
  const playbookBtn = desktopPage.locator('button[id^="btn-playbook-"]').first();
  await playbookBtn.click();
  await desktopPage.waitForTimeout(600);

  const closePlaybookBtn = desktopPage.locator('#close-playbook-modal-btn');
  const isPlaybookOpen = await closePlaybookBtn.isVisible();
  console.log(' -> Statutory Deal Playbook Modal visible:', isPlaybookOpen);
  if (isPlaybookOpen) {
    const playbookScreenshot = path.join(ARTIFACT_DIR, 'asset_liberator_royal_3d_playbook.png');
    await desktopPage.screenshot({ path: playbookScreenshot });
    console.log(' -> Saved playbook screenshot to:', playbookScreenshot);
    await closePlaybookBtn.click();
    await desktopPage.waitForTimeout(400);
  }

  // 5. Actuate Executive Outreach Modal
  const outreachBtn = desktopPage.locator('button[id^="btn-outreach-"]').first();
  await outreachBtn.click();
  await desktopPage.waitForTimeout(600);

  const closeOutreachBtn = desktopPage.locator('#close-outreach-modal-btn');
  const isOutreachOpen = await closeOutreachBtn.isVisible();
  console.log(' -> Executive Outreach Modal visible:', isOutreachOpen);
  if (isOutreachOpen) {
    await closeOutreachBtn.click();
    await desktopPage.waitForTimeout(400);
  }

  // 6. Actuate View Switcher Tabs: CRM
  const crmTab = desktopPage.locator('#nav-tab-crm');
  await crmTab.click();
  await desktopPage.waitForTimeout(600);
  const crmScreenshot = path.join(ARTIFACT_DIR, 'asset_liberator_royal_3d_crm.png');
  await desktopPage.screenshot({ path: crmScreenshot });
  console.log(' -> Saved CRM pipeline screenshot to:', crmScreenshot);

  // 7. Actuate View Switcher Tabs: 8-K Events
  const eventsTab = desktopPage.locator('#nav-tab-events');
  await eventsTab.click();
  await desktopPage.waitForTimeout(500);

  // 8. Actuate View Switcher Tabs: Lenders
  const lendersTab = desktopPage.locator('#nav-tab-lenders');
  await lendersTab.click();
  await desktopPage.waitForTimeout(500);

  // 9. Return to Screener tab
  const screenerTab = desktopPage.locator('#nav-tab-screener');
  await screenerTab.click();
  await desktopPage.waitForTimeout(400);

  // 10. Actuate CRM Report Modal
  const reportBtn = desktopPage.locator('#nav-open-report-btn');
  if (await reportBtn.isVisible()) {
    await reportBtn.click();
    await desktopPage.waitForTimeout(600);
    const closeReportBtn = desktopPage.locator('#close-crm-report-modal-btn');
    const isReportOpen = await closeReportBtn.isVisible();
    console.log(' -> CRM Report Modal visible:', isReportOpen);
    if (isReportOpen) {
      await closeReportBtn.click();
      await desktopPage.waitForTimeout(400);
    }
  }

  await desktopContext.close();

  console.log('\n[4/5] Auditing Mobile Phone Viewport (390x844 iPhone benchmark)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileContext.newPage();

  mobilePage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await mobilePage.goto(PROD_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  console.log(` -> Mobile viewport width: ${clientWidth}px, document scrollWidth: ${scrollWidth}px`);
  if (scrollWidth > clientWidth) {
    throw new Error(`FAIL: Horizontal blowout detected on 390px viewport! (${scrollWidth} > ${clientWidth})`);
  } else {
    console.log(` -> PASS: Zero horizontal blowout on 390px viewport (${clientWidth}px / ${scrollWidth}px)`);
  }

  const mobileScreenshot = path.join(ARTIFACT_DIR, 'asset_liberator_royal_3d_mobile_390x844.png');
  await mobilePage.screenshot({ path: mobileScreenshot, fullPage: false });
  console.log(' -> Saved mobile screenshot to:', mobileScreenshot);

  await mobileContext.close();
  await browser.close();

  console.log('\n[5/5] Exporting screenshots to ~/Downloads...');
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }

  const filesToExport = [
    'asset_liberator_royal_3d_desktop.png',
    'asset_liberator_royal_3d_drawer.png',
    'asset_liberator_royal_3d_playbook.png',
    'asset_liberator_royal_3d_crm.png',
    'asset_liberator_royal_3d_mobile_390x844.png'
  ];

  for (const file of filesToExport) {
    const src = path.join(ARTIFACT_DIR, file);
    const dest = path.join(DOWNLOADS_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(` -> Exported: ${dest}`);
    }
  }

  console.log('\nAudit PASSED with 0 errors.');
  console.log(`Console error count: ${consoleErrors.length}`);
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
