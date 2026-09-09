import path from 'path';
import fs from 'fs';
const tmpDir = path.resolve('.tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
process.env.TEMP = tmpDir;
process.env.TMP = tmpDir;
import { chromium } from 'playwright';

async function main() {
  console.log('Launching Edge browser...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const logs = [];
  const errors = [];
  
  page.on('console', msg => {
    const text = `[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`;
    console.log(text);
    logs.push(text);
  });

  page.on('pageerror', err => {
    const text = `[PAGE ERROR] ${err.message}\n${err.stack}`;
    console.error(text);
    errors.push(text);
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`[HTTP ${resp.status()}] ${resp.url()}`);
    }
  });

  page.on('requestfailed', req => {
    const text = `[REQUEST FAILED] ${req.method()} ${req.url()} - ${req.failure()?.errorText}`;
    console.error(text);
    errors.push(text);
  });

  for (const urlPath of ['/']) {
    console.log(`\n================ Testing ${urlPath} ================`);
    try {
      const response = await page.goto(`http://localhost:8080${urlPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      console.log('Page response status:', response?.status());
    } catch (e) {
      console.error('Goto error:', e.message);
    }
    await page.waitForTimeout(3000);
    const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'NO ROOT ELEMENT');
    console.log(`${urlPath} Root innerHTML length:`, rootHtml.length);
    await page.screenshot({ path: 'home-unkey-screenshot.png' });
    console.log('Saved screenshot to home-unkey-screenshot.png');

    // Scroll to Control Plane & 5-stage workflow
    await page.evaluate(() => window.scrollBy(0, 1100));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'home-workflow-screenshot.png' });
    console.log('Saved screenshot to home-workflow-screenshot.png');

    // Scroll to Architecture Burger Stack
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'home-burger-stack-screenshot.png' });
    console.log('Saved screenshot to home-burger-stack-screenshot.png');

    // Scroll to Telemetry & Developer Portal
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'home-histogram-screenshot.png' });
    console.log('Saved screenshot to home-histogram-screenshot.png');

    // Scroll to CTA & Footer
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'home-footer-screenshot.png' });
    console.log('Saved screenshot to home-footer-screenshot.png');
  }

  // 2. Test /projects
  console.log(`\n================ Testing /projects ================`);
  try {
    const resp = await page.goto('http://localhost:8080/projects', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('/projects status:', resp?.status());
  } catch (e) {
    console.error('Projects goto error:', e.message);
  }
  await page.waitForTimeout(3000);
  const projectsHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || '');
  console.log('/projects Root innerHTML length:', projectsHtml.length);
  await page.screenshot({ path: 'projects-screenshot.png' });
  console.log('Saved screenshot to projects-screenshot.png');

  // Scroll down to repository cards grid to see micro 3D previews
  await page.evaluate(() => window.scrollBy(0, 650));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'projects-cards-screenshot.png' });
  console.log('Saved screenshot to projects-cards-screenshot.png');

  // 3. Test /navigator
  console.log(`\n================ Testing /navigator ================`);
  try {
    const resp = await page.goto('http://localhost:8080/navigator', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('/navigator status:', resp?.status());
  } catch (e) {
    console.error('Navigator goto error:', e.message);
  }
  await page.waitForTimeout(3000);
  const navigatorHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || '');
  console.log('/navigator Root innerHTML length:', navigatorHtml.length);
  await page.screenshot({ path: 'navigator-screenshot.png' });
  console.log('Saved screenshot to navigator-screenshot.png');

  // 4. Test /world
  console.log(`\n================ Testing /world ================`);
  try {
    const resp = await page.goto('http://localhost:8080/world', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('/world status:', resp?.status());
  } catch (e) {
    console.error('World goto error:', e.message);
  }
  await page.waitForTimeout(4000);
  const worldHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || '');
  console.log('/world Root innerHTML length:', worldHtml.length);
  await page.screenshot({ path: 'world-screenshot.png' });
  console.log('Saved screenshot to world-screenshot.png');

  await browser.close();
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
