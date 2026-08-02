import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import publicationRedirects from './src/data/publication-redirects.json';

export default defineConfig({
  site: 'https://mw-lab.ru',
  base: process.env.ASTRO_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: Object.fromEntries(
    Object.entries(publicationRedirects).map(([slug, target]) => [`/publications/${slug}/`, target]),
  ),
});
