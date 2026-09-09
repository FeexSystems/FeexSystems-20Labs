import path from 'path';
import fs from 'fs';
const tmpDir = path.resolve('.tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
process.env.TEMP = tmpDir;
process.env.TMP = tmpDir;
import { chromium } from 'playwright';

async function main() {
  console.log('Launching Edge for Multimedia Showcase capture...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Home page captures
  console.log('Navigating to http://localhost:8080/');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);

  // Scroll to Horizontal Project Slider
  const sliderElem = await page.$('text=Living Ecosystem Projects');
  if (sliderElem) {
    await sliderElem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'showcase-carousel-slider.png' });
    console.log('Saved showcase-carousel-slider.png');
  }

  // Scroll to Bento Grid
  const bentoElem = await page.$('text=EVIDENCE FABRIC & MODEL REASONING');
  if (bentoElem) {
    await bentoElem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'showcase-bento-grid.png' });
    console.log('Saved showcase-bento-grid.png');
  }

  // Scroll to Video Dialog
  const videoElem = await page.$('text=Watch the Living World Model in Action');
  if (videoElem) {
    await videoElem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'showcase-video-card.png' });
    console.log('Saved showcase-video-card.png');

    // Click play button to verify modal opens
    const playBtn = await page.$('button:has(svg.size-7)');
    if (playBtn) {
      await playBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'showcase-video-modal-open.png' });
      console.log('Saved showcase-video-modal-open.png');
      // Press Escape or click close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }

  // 2. Navigator query & Text Scramble capture
  console.log('Navigating to http://localhost:8080/navigator?q=PostgreSQL');
  await page.goto('http://localhost:8080/navigator?q=PostgreSQL', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'showcase-navigator-scramble.png' });
  console.log('Saved showcase-navigator-scramble.png');

  await browser.close();
  console.log('Showcase visual capture complete.');
}

main().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
