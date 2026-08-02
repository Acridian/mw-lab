import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const productsDirectory = path.join(root, 'src/content/products');
const productFiles = (await readdir(productsDirectory)).filter((file) => file.endsWith('.md'));

const publicationRedirects = {
  '612-2': 'https://cs.groteck.ru/SATCOM_2025/index.html',
  'modernizatsiya-psss-drive-away': 'https://cs.groteck.ru/SATCOM_2025/68/index.html',
  'novye-produkty-2': 'https://cs.groteck.ru/SATCOM_2025/104/index.html',
  'sputnikovaya-svyaz-i-veschanie-2024': 'https://cs.groteck.ru/SATCOM_2024/index.html',
  'postavka-produktsii-sobstvennoy-razrabotki': 'https://cs.groteck.ru/SATCOM_2024/85/index.html',
  'novye-produkty-2024': 'https://cs.groteck.ru/SATCOM_2024/117/index.html',
  'sputnikovaya-svyaz-i-veschanie': 'https://cs.groteck.ru/SATCOM_2023/index.html',
  'razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-5':
    'https://cs.groteck.ru/SATCOM_2023/54/index.html',
  'razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-4':
    'https://cs.groteck.ru/SATCOM_2023/76/index.html',
  'novye-produkty': 'https://cs.groteck.ru/SATCOM_2023/96/index.html',
};

if (productFiles.length !== 43) {
  throw new Error(`Expected 43 product records, found ${productFiles.length}`);
}

const expectedRoutes = [
  'index.html',
  'catalog/index.html',
  'publikatsii/index.html',
  'kontakty/index.html',
  'privacy-policy/index.html',
  'spasibo/index.html',
  '404.html',
  'tovary/generatory/index.html',
  'tovary/kommutatory-signalov/index.html',
  'tovary/preobrazovateli-chastot/index.html',
  'tovary/sistemy-rezervirovanya/index.html',
  'tovary/usiliteli-moschnosti/index.html',
  'tovary/elementy-antenno-volnovodnogo-trakta/index.html',
  ...Object.keys(publicationRedirects).map((slug) => `${slug}/index.html`),
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

const redirects = await readFile(path.join(root, 'dist/_redirects'), 'utf8');
for (const [slug, target] of Object.entries(publicationRedirects)) {
  const rule = `/${slug}/ ${target} 301!`;
  if (!redirects.includes(rule)) throw new Error(`Missing Netlify redirect: ${rule}`);
}

const contactHtml = await readFile(path.join(root, 'dist/kontakty/index.html'), 'utf8');
for (const token of [
  'name="contact"',
  'method="POST"',
  'action="/spasibo/"',
  'data-netlify="true"',
  'name="form-name" value="contact"',
  'name="consent" type="checkbox" required',
]) {
  if (!contactHtml.includes(token)) throw new Error(`Contact form is missing: ${token}`);
}

for (const route of ['spasibo/index.html', '404.html']) {
  const html = await readFile(path.join(root, 'dist', route), 'utf8');
  if (!html.includes('name="robots" content="noindex, follow"')) {
    throw new Error(`${route} must be noindex`);
  }
}

const robots = await readFile(path.join(root, 'dist/robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://mw-lab.ru/sitemap-index.xml')) {
  throw new Error('robots.txt must advertise the production sitemap');
}

const sitemapFiles = (await readdir(path.join(root, 'dist'))).filter((file) =>
  /^sitemap-\d+\.xml$/.test(file),
);
const sitemap = (
  await Promise.all(sitemapFiles.map((file) => readFile(path.join(root, 'dist', file), 'utf8')))
).join('\n');
if (!sitemap.includes('<loc>https://mw-lab.ru/catalog/</loc>'))
  throw new Error('Catalog is missing from sitemap');
if (sitemap.includes('<loc>https://mw-lab.ru/spasibo/</loc>'))
  throw new Error('Thank-you page must not be in sitemap');

console.log(
  `Verified ${productFiles.length} products, ${expectedRoutes.length} routes, redirects, form, and search metadata.`,
);
