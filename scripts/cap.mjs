import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'src/assets/images/publications');

const browser = await chromium.launch({ headless: true });

// Try narrow viewport -> single page mode
const ctx = await browser.newContext({ viewport: { width: 640, height: 960 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

console.log('Loading URL /55/ at 640x960...');
await page.goto('https://cs.groteck.ru/SATCOM_2023/55/index.html', { waitUntil: 'networkidle', timeout: 30000 });
await page.evaluate(() => {
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
});
await page.waitForTimeout(10000);

const imgs = await page.evaluate(() => {
  const pager = document.querySelector('#pager-val');
  return {
    pager: pager?.value,
    vw: window.innerWidth,
    vh: window.innerHeight,
    images: Array.from(document.querySelectorAll('#flipbook-container img'))
      .filter(img => img.offsetWidth > 0)
      .map(img => ({
        page: img.src.includes('page-html5-substrates') ? img.src.replace(/^.*page(\d+)_(\d)\.jpg.*$/, '$1_$2') : '_',
        left: Math.round(img.getBoundingClientRect().left),
        top: Math.round(img.getBoundingClientRect().top),
        ow: img.offsetWidth,
        oh: img.offsetHeight,
        isSubstrate: img.src.includes('page-html5-substrates'),
      })),
  };
});
console.log(JSON.stringify(imgs, null, 2));

if (imgs.images.length > 0) {
  const subs = imgs.images.filter(i => i.isSubstrate);
  if (subs.length > 0) {
    const sorted = subs.sort((a, b) => a.left - b.left);
    const first = sorted[0];
    console.log(`Using page ${first.page}`);
    await page.screenshot({
      path: path.join(outDir, 'drive-away-modernization-2023.png'),
      clip: { x: first.left, y: first.top, width: first.ow, height: first.oh },
    });
    console.log('Saved.');
  }
}

await ctx.close();
await browser.close();
