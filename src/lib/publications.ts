import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import publicationRedirects from '../data/publication-redirects.json';

interface PublicationRecord {
  entry: CollectionEntry<'publications'>;
  image: ImageMetadata;
  slug: string;
  externalUrl: string;
}

const redirects = publicationRedirects as Record<string, string>;

const publicationRoutes: Record<string, { slug: string }> = {
  'sputnikovaya-svyaz-i-veschanie-2026': { slug: 'satellite-communications-and-broadcasting-2026' },
  'seriynoe-proizvodstvo-rossiyskikh-svch-usiliteley': {
    slug: 'serial-production-of-russian-microwave-amplifiers',
  },
  'novye-produkty-95': { slug: 'new-products-2026-95' },
  'novye-produkty-98': { slug: 'projects-and-solutions-2026' },
  '612-2': { slug: 'satellite-communications-and-broadcasting-2025' },
  'modernizatsiya-psss-drive-away': { slug: 'drive-away-station-modernization-2025' },
  'novye-produkty-2': { slug: 'new-products-2025' },
  'sputnikovaya-svyaz-i-veschanie-2024': { slug: 'satellite-communications-and-broadcasting-2024' },
  'postavka-produktsii-sobstvennoy-razrabotki': { slug: 'in-house-products-2024' },
  'novye-produkty-2024': { slug: 'new-products-2024' },
  'sputnikovaya-svyaz-i-veschanie': { slug: 'satellite-communications-and-broadcasting-2023' },
  'razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-5': {
    slug: 'mobile-satellite-station-modernization-2023',
  },
  'razrabotka-i-postavka-oborudovaniya-sputnikovoy-svyazi-4': {
    slug: 'multi-satellite-communications-systems-2023',
  },
  'novye-produkty': { slug: 'new-products-2023' },
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
      const externalUrl = redirects[route.slug];
      if (!image || !externalUrl) throw new Error(`Incomplete publication mapping: ${entry.id}`);
      return { entry, image, slug: route.slug, externalUrl };
    })
    .sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf());
}
