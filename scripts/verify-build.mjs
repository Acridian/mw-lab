import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const productsDirectory = path.join(root, 'src/content/products');
const productFiles = (await readdir(productsDirectory)).filter((file) => file.endsWith('.md'));

if (productFiles.length !== 43) {
  throw new Error(`Expected 43 product records, found ${productFiles.length}`);
}

const expectedRoutes = [
  'index.html',
  'catalog/index.html',
  'publikatsii/index.html',
  'kontakty/index.html',
  'privacy-policy/index.html',
  'tovary/generatory/index.html',
  'tovary/kommutatory-signalov/index.html',
  'tovary/preobrazovateli-chastot/index.html',
  'tovary/sistemy-rezervirovanya/index.html',
  'tovary/usiliteli-moschnosti/index.html',
  'tovary/elementy-antenno-volnovodnogo-trakta/index.html',
  ...productFiles.map((file) => `catalog/${file.replace(/\.md$/, '')}/index.html`),
];

for (const route of expectedRoutes) {
  await stat(path.join(root, 'dist', route));
}

const htmlFiles = expectedRoutes.filter((route) => route.endsWith('.html'));
const forbidden = ['AstroWind', 'intergalactic-ice', '/documents/passports/', '/documents/datasheets/'];

for (const route of htmlFiles) {
  const html = await readFile(path.join(root, 'dist', route), 'utf8');
  for (const token of forbidden) {
    if (html.includes(token)) throw new Error(`Found forbidden token "${token}" in ${route}`);
  }
}

await stat(path.join(root, 'dist/downloads/kartochka-mwlab.pdf'));

console.log(`Verified ${productFiles.length} products and ${expectedRoutes.length} primary routes.`);
