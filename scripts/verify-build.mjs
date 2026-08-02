import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const productsDirectory = path.join(root, 'src/content/products');
const productFiles = (await readdir(productsDirectory)).filter((file) => file.endsWith('.md'));
const productRoutes = JSON.parse(await readFile(path.join(root, 'src/data/product-routes.json'), 'utf8'));

const publicationRedirects = JSON.parse(
  await readFile(path.join(root, 'src/data/publication-redirects.json'), 'utf8'),
);

const categoryRoutes = [
  'signal-generators',
  'signal-switches',
  'frequency-converters',
  'redundancy-systems',
  'power-amplifiers',
  'antenna-waveguide-components',
];

const legacyRouteRedirects = {
  '/publikatsii/': '/publications/',
  '/kontakty/': '/contact/',
  '/downloads/kartochka-mwlab.pdf': '/downloads/company-details.pdf',
  '/tovary/generatory/': '/products/signal-generators/',
  '/tovary/kommutatory-signalov/': '/products/signal-switches/',
  '/tovary/preobrazovateli-chastot/': '/products/frequency-converters/',
  '/tovary/sistemy-rezervirovanya/': '/products/redundancy-systems/',
  '/tovary/usiliteli-moschnosti/': '/products/power-amplifiers/',
  '/tovary/elementy-antenno-volnovodnogo-trakta/': '/products/antenna-waveguide-components/',
};

const legacyPublicationRedirects = {
  '/612-2/': 'https://cs.groteck.ru/SATCOM_2025/index.html',
  '/modernizatsiya-psss-drive-away/': 'https://cs.groteck.ru/SATCOM_2025/68/index.html',
  '/novye-produkty-2/': 'https://cs.groteck.ru/SATCOM_2025/104/index.html',
  '/sputnikovaya-svyaz-i-veschanie-2024/': 'https://cs.groteck.ru/SATCOM_2024/index.html',
  '/postavka-produktsii-sobstvennoy-razrabotki/': 'https://cs.groteck.ru/SATCOM_2024/85/index.html',
  '/novye-produkty-2024/': 'https://cs.groteck.ru/SATCOM_2024/117/index.html',
  '/sputnikovaya-svyaz-i-veschanie/': 'https://cs.groteck.ru/SATCOM_2023/index.html',
  '/razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-5/':
    'https://cs.groteck.ru/SATCOM_2023/54/index.html',
  '/razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-4/':
    'https://cs.groteck.ru/SATCOM_2023/76/index.html',
  '/novye-produkty/': 'https://cs.groteck.ru/SATCOM_2023/96/index.html',
};

if (productFiles.length !== 43) {
  throw new Error(`Expected 43 product records, found ${productFiles.length}`);
}

const productIds = productFiles.map((file) => file.replace(/\.md$/, '')).sort();
const mappedProductIds = Object.keys(productRoutes).sort();
if (JSON.stringify(productIds) !== JSON.stringify(mappedProductIds)) {
  throw new Error('English product route manifest does not match the product collection');
}

const englishProductSlugs = Object.values(productRoutes);
if (new Set(englishProductSlugs).size !== englishProductSlugs.length) {
  throw new Error('English product routes must be unique');
}
for (const slug of englishProductSlugs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid English product route: ${slug}`);
}

const expectedRoutes = [
  'index.html',
  'catalog/index.html',
  'publications/index.html',
  'contact/index.html',
  'privacy-policy/index.html',
  '404.html',
  ...categoryRoutes.map((slug) => `products/${slug}/index.html`),
  ...Object.keys(publicationRedirects).map((slug) => `publications/${slug}/index.html`),
  ...englishProductSlugs.map((slug) => `catalog/${slug}/index.html`),
];

for (const route of expectedRoutes) {
  await stat(path.join(root, 'dist', route));
}

const htmlFiles = expectedRoutes.filter((route) => route.endsWith('.html'));
const forbidden = [];
const forbiddenInternalPaths = ['/publikatsii/', '/kontakty/', '/spasibo/', '/tovary/'];

for (const route of htmlFiles) {
  const html = await readFile(path.join(root, 'dist', route), 'utf8');
  for (const token of forbidden) {
    if (html.includes(token)) throw new Error(`Found forbidden token "${token}" in ${route}`);
  }
  for (const oldPath of forbiddenInternalPaths) {
    if (html.includes(`href="${oldPath}`) || html.includes(`action="${oldPath}`)) {
      throw new Error(`Found legacy internal URL "${oldPath}" in ${route}`);
    }
  }
  for (const productId of productIds) {
    if (productRoutes[productId] !== productId && html.includes(`href="/catalog/${productId}/"`)) {
      throw new Error(`Found legacy product URL in ${route}: ${productId}`);
    }
  }
}

await stat(path.join(root, 'dist/downloads/company-details.pdf'));

const redirects = await readFile(path.join(root, 'dist/_redirects'), 'utf8');
for (const [slug, target] of Object.entries(publicationRedirects)) {
  const rule = `/publications/${slug}/ ${target} 301!`;
  if (!redirects.includes(rule)) throw new Error(`Missing Netlify redirect: ${rule}`);
}
for (const [productId, slug] of Object.entries(productRoutes)) {
  if (productId === slug) continue;
  const rule = `/catalog/${productId}/ /catalog/${slug}/ 301!`;
  if (!redirects.includes(rule)) throw new Error(`Missing legacy product redirect: ${rule}`);
}
for (const [source, target] of Object.entries({ ...legacyRouteRedirects, ...legacyPublicationRedirects })) {
  const rule = `${source} ${target} 301!`;
  if (!redirects.includes(rule)) throw new Error(`Missing legacy route redirect: ${rule}`);
}

const publicationsHtml = await readFile(path.join(root, 'dist/publications/index.html'), 'utf8');
if ((publicationsHtml.match(/class="publication-media"/g) ?? []).length !== 10) {
  throw new Error('Expected ten uniform publication preview frames');
}
for (const slug of Object.keys(publicationRedirects)) {
  if (!publicationsHtml.includes(`href="/publications/${slug}/"`)) {
    throw new Error(`Publication archive is missing English link: ${slug}`);
  }
}

const contactHtml = await readFile(path.join(root, 'dist/contact/index.html'), 'utf8');
if (!contactHtml.includes('yandex-map')) throw new Error('Contact page is missing Yandex map');
if (!contactHtml.includes('Карточка предприятия')) throw new Error('Contact page is missing PDF link');
if (!contactHtml.includes('api-maps.yandex.ru'))
  throw new Error('Contact page is missing valid Yandex map URL');

for (const route of ['404.html']) {
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
for (const oldPath of forbiddenInternalPaths) {
  if (sitemap.includes(`<loc>https://mw-lab.ru${oldPath}`)) {
    throw new Error(`Legacy URL must not appear in sitemap: ${oldPath}`);
  }
}

console.log(
  `Verified ${productFiles.length} products, ${expectedRoutes.length} routes, redirects, and search metadata.`,
);
