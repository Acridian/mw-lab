import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

interface PublicationRecord {
  entry: CollectionEntry<'publications'>;
  image: ImageMetadata;
  slug: string;
  externalUrl: string;
}

const publicationRoutes: Record<string, { slug: string; externalUrl: string }> = {
  '612-2': {
    slug: 'satellite-communications-and-broadcasting-2025',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2025/index.html',
  },
  'modernizatsiya-psss-drive-away': {
    slug: 'drive-away-station-modernization-2025',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2025/68/index.html',
  },
  'novye-produkty-2': {
    slug: 'new-products-2025',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2025/104/index.html',
  },
  'sputnikovaya-svyaz-i-veschanie-2024': {
    slug: 'satellite-communications-and-broadcasting-2024',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2024/index.html',
  },
  'postavka-produktsii-sobstvennoy-razrabotki': {
    slug: 'in-house-products-2024',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2024/85/index.html',
  },
  'novye-produkty-2024': {
    slug: 'new-products-2024',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2024/117/index.html',
  },
  'sputnikovaya-svyaz-i-veschanie': {
    slug: 'satellite-communications-and-broadcasting-2023',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2023/index.html',
  },
  'razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-5': {
    slug: 'mobile-satellite-station-modernization-2023',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2023/54/index.html',
  },
  'razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-4': {
    slug: 'multi-satellite-communications-systems-2023',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2023/76/index.html',
  },
  'novye-produkty': {
    slug: 'new-products-2023',
    externalUrl: 'https://cs.groteck.ru/SATCOM_2023/96/index.html',
  },
};

const publicationImageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/publications/*',
  { eager: true },
);

const publicationImages = new Map(
  Object.entries(publicationImageModules).map(([path, module]) => [path.split('/').at(-1), module.default]),
);

export async function getPublications(): Promise<PublicationRecord[]> {
  const entries = await getCollection('publications');
  return entries
    .map((entry) => {
      const image = publicationImages.get(entry.data.coverImage);
      const route = publicationRoutes[entry.id];
      if (!image || !route) throw new Error(`Incomplete publication mapping: ${entry.id}`);
      return { entry, image, ...route };
    })
    .sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf());
}
