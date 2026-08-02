import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import publicationRedirects from './src/data/publication-redirects.json';

export default defineConfig({
  site: 'https://mw-lab.ru',
  base: process.env.ASTRO_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        if (item.url === 'https://mw-lab.ru/') {
          return { ...item, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() } as typeof item;
        }
        if (item.url.startsWith('https://mw-lab.ru/catalog/') && item.url !== 'https://mw-lab.ru/catalog/') {
          return { ...item, changefreq: 'weekly', priority: 0.8 } as typeof item;
        }
        if (item.url.startsWith('https://mw-lab.ru/products/')) {
          return { ...item, changefreq: 'weekly', priority: 0.8 } as typeof item;
        }
        if (item.url === 'https://mw-lab.ru/catalog/') {
          return { ...item, changefreq: 'weekly', priority: 0.8 } as typeof item;
        }
        if (item.url === 'https://mw-lab.ru/contact/') {
          return { ...item, changefreq: 'monthly', priority: 0.7 } as typeof item;
        }
        if (item.url === 'https://mw-lab.ru/publications/') {
          return { ...item, changefreq: 'monthly', priority: 0.7 } as typeof item;
        }
        if (item.url === 'https://mw-lab.ru/privacy-policy/') {
          return { ...item, changefreq: 'monthly', priority: 0.3 } as typeof item;
        }
        return item;
      },
    }),
  ],
  redirects: Object.fromEntries(
    Object.entries(publicationRedirects).map(([slug, target]) => [`/publications/${slug}/`, target]),
  ),
});
