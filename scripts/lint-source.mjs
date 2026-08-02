import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');

const IMG_TAG = /<img\s/gi;

const ALLOWED = new Set([
  'src/components/Header.astro',
  'src/components/Footer.astro',
]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.name.endsWith('.astro')) {
      yield fullPath;
    }
  }
}

let failures = 0;

console.log('# Raw <img> tag check');
for await (const file of walk(srcDir)) {
  const rel = path.relative(root, file);
  const source = await readFile(file, 'utf8');
  const hasImg = IMG_TAG.test(source);
  if (!hasImg) continue;

  if (ALLOWED.has(rel)) {
    console.log(`  ALLOWED: ${rel} (logo in public/, not optimizable)`);
    continue;
  }

  console.error(`  FAIL: ${rel} — replace <img> with <Image> from astro:assets`);
  failures++;
}

if (failures > 0) {
  console.error(`\n${failures} file(s) use raw <img> tags. Use the <Image /> component.`);
  console.error('Add exceptions to ALLOWED in scripts/lint-source.mjs only for public/ assets.');
  process.exitCode = 1;
}

console.log('# Product asset manifest check');
const assetsPath = path.join(root, 'src/data/product-assets.json');
const imagesDir = path.join(root, 'src/assets/images/products');
const pdfsDir = path.join(root, 'public/downloads/products');

const manifest = JSON.parse(await readFile(assetsPath, 'utf8'));
const localImages = new Set(await readdir(imagesDir));
let pdfs;
try {
  pdfs = new Set(await readdir(pdfsDir));
} catch {
  pdfs = new Set();
}

let assetFailures = 0;

for (const [productId, data] of Object.entries(manifest)) {
  for (const filename of data.gallery ?? []) {
    if (!localImages.has(filename)) {
      console.error(`  MISSING IMAGE: ${productId} -> ${filename}`);
      assetFailures++;
    }
  }
  for (const doc of data.documents ?? []) {
    if (!doc.filename) continue;
    if (!pdfs.has(doc.filename)) {
      console.error(`  MISSING PDF: ${productId} -> ${doc.filename}`);
      assetFailures++;
    }
  }
}

if (assetFailures > 0) {
  console.error(`\n${assetFailures} asset file(s) referenced in manifest but missing on disk.`);
  process.exitCode = 1;
}

if (!process.exitCode) {
  console.log('Source lint passed.');
}

process.exit(process.exitCode ?? 0);
