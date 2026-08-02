import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mw-lab.ru',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://mw-lab.ru/thank-you/',
    }),
  ],
  redirects: {
    '/publications/satellite-communications-and-broadcasting-2025/':
      'https://cs.groteck.ru/SATCOM_2025/index.html',
    '/publications/drive-away-station-modernization-2025/': 'https://cs.groteck.ru/SATCOM_2025/68/index.html',
    '/publications/new-products-2025/': 'https://cs.groteck.ru/SATCOM_2025/104/index.html',
    '/publications/satellite-communications-and-broadcasting-2024/':
      'https://cs.groteck.ru/SATCOM_2024/index.html',
    '/publications/in-house-products-2024/': 'https://cs.groteck.ru/SATCOM_2024/85/index.html',
    '/publications/new-products-2024/': 'https://cs.groteck.ru/SATCOM_2024/117/index.html',
    '/publications/satellite-communications-and-broadcasting-2023/':
      'https://cs.groteck.ru/SATCOM_2023/index.html',
    '/publications/mobile-satellite-station-modernization-2023/':
      'https://cs.groteck.ru/SATCOM_2023/54/index.html',
    '/publications/multi-satellite-communications-systems-2023/':
      'https://cs.groteck.ru/SATCOM_2023/76/index.html',
    '/publications/new-products-2023/': 'https://cs.groteck.ru/SATCOM_2023/96/index.html',
  },
});
