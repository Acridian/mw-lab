import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mw-lab.ru',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://mw-lab.ru/spasibo/',
    }),
  ],
  redirects: {
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
  },
});
