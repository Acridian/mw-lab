import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

interface PublicationRecord {
  entry: CollectionEntry<'publications'>;
  image: ImageMetadata;
  externalUrl: string;
}

const externalUrls: Record<string, string> = {
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
      const externalUrl = externalUrls[entry.id];
      if (!image || !externalUrl) throw new Error(`Incomplete publication mapping: ${entry.id}`);
      return { entry, image, externalUrl };
    })
    .sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf());
}
