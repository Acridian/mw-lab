import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import productRoutes from '../data/product-routes.json';
import productAssets from '../data/product-assets.json';

export interface ProductCategory {
  slug: string;
  title: string;
  description: string;
  image: string;
  productSlugs: string[];
}

export interface ProductDocument {
  label: string;
  filename: string;
}

export interface ProductRecord {
  entry: CollectionEntry<'products'>;
  slug: string;
  category: ProductCategory;
  image: ImageMetadata;
  gallery: ImageMetadata[];
  documents: ProductDocument[];
  excerpt: string;
}

export const categories: ProductCategory[] = [
  {
    slug: 'signal-generators',
    title: 'Генераторы сигналов',
    description:
      'Генераторы ВЧ и СВЧ-сигналов: блоки гетеродинов, резервированные генераторы и формирователи опорных частот для наземных станций спутниковой связи',
    image: 'brg10-scaled.jpg',
    productSlugs: [
      'blok-geterodina-bg3131',
      'blok-geterodina-bg3636',
      'blok-geterodina-upravlyaemyy-bgu1820-opytnyy-obrazets',
      'blok-rezervirovannogo-generatora-brg10h8',
      'blok-generatora-i-interfeysov-bgi',
    ],
  },
  {
    slug: 'signal-switches',
    title: 'Коммутаторы сигналов',
    description:
      'Управляемые коммутаторы сигналов L-диапазона для построения отказоустойчивых трактов спутниковой связи с резервированием 1:1',
    image: 'img_4587-scaled.jpg',
    productSlugs: [
      'kommutator-mikrotik-crs310-1g-5s-4s-in-upravlyaemyy-9',
      'kommutator-mikrotik-crs310-1g-5s-4s-in-upravlyaemyy-8',
    ],
  },
  {
    slug: 'frequency-converters',
    title: 'Преобразователи частоты',
    description:
      'Конверторы и преобразователи СВЧ-сигналов диапазонов C, X, Ku для спутниковых систем связи и телекоммуникационного оборудования',
    image: 'bpr0917-1314g-scaled.jpg',
    productSlugs: [
      'konvertor-bpr0917-1314og',
      'konvertor-bpr0915-7884',
      'konvertor-bpr0917-5765m',
      'konvertor-bpr7475-1112',
      'konvertor-bpr8485-2222',
      'konvertor-bpr2222-8485',
    ],
  },
  {
    slug: 'redundancy-systems',
    title: 'Системы резервирования 1:1',
    description:
      'Системы резервирования 1:1 для наземных станций спутниковой связи: блоки питания, волноводные нагрузки, переключатели и блоки коммутации',
    image: 'brip300-48-scaled.jpg',
    productSlugs: [
      'blok-rezervirovannogo-istochnika-pitaniya-brip300-48',
      'nagruzka-volnovodnaya-bn-wr75-0-5',
      'nagruzka-volnovodnaya-bn-wr75-250',
      'blok-kommutatsii-i-rezervirovaniya-bkr0917-4h2',
      'nagruzka-bn-wr62g-1000',
      'volnovodnye-pereklyuchateli',
      'pereklyuchatel-volnovodnyy-ast75w',
      'volnovodnyy-pereklyuchatel-mm137',
      'blok-nagruzki-bnwr75-250',
    ],
  },
  {
    slug: 'power-amplifiers',
    title: 'Усилители мощности',
    description:
      'Усилители мощности СВЧ-сигналов частотой от 400 МГц до 15 ГГц, выходной мощностью от единиц до сотен ватт',
    image: 'um2021-100-input-scaled.jpg',
    productSlugs: [
      'usilitel-moschnosti-um1822-12',
      'usilitel-moschnosti-um0404-70',
      'usilitel-moschnosti-um0101-10',
      'usilitel-moschnosti-um2021-100',
      'usilitel-moschnosti-um5964-15-4',
      'usilitel-moschnosti-um5860-2',
      'rezervirovannyy-usilitel-moschnosti-um2021-100r',
      'konvertor-bpr0917-1314-40',
      'usilitel-moschnosti-um2424-60',
    ],
  },
  {
    slug: 'antenna-waveguide-components',
    title: 'Элементы антенно-волноводного тракта',
    description:
      'Волноводные вставки, коаксиальные сумматоры и делители, направленные ответвители, коаксиально-волноводные переходы, кабельные сборки',
    image: 'pc-1x2-1-scaled.jpg',
    productSlugs: [
      'volnovodnaya-vstavka-wr75',
      'splitter-rs0825-1sx2s',
      'splitter-rs0825-1nx2n',
      'splinter-rs0825-1nx4n',
      'volnovodnaya-vstavka',
      'kabelnye-sborki',
      'fidernye-kabelnye-sborki',
      'komplekt-zaschity-ot-atmosfernyh-vozdeystviy-dlya-razemov-i-antenn',
      'gibkiy-volnovod-wr112',
      'gibkiy-volnovod-wr75',
      'poluzhestkie-kabelnye-sborki',
      'volnovodnyy-adapter-wr75g-wr62g',
    ],
  },
];

const productImageModules = import.meta.glob<{ default: ImageMetadata }>('../assets/images/products/*', {
  eager: true,
});

const productImages = new Map(
  Object.entries(productImageModules).map(([path, module]) => [path.split('/').at(-1), module.default]),
);

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

function validateAssetFilename(filename: string): boolean {
  return SAFE_FILENAME.test(filename) && !filename.includes('/') && !filename.includes('\\');
}

export function getProductImage(filename: string): ImageMetadata {
  const image = productImages.get(filename);
  if (!image) throw new Error(`Missing product image: ${filename}`);
  return image;
}

function plainText(markdown: string): string {
  return markdown
    .replace(/\*\*?_?(.+?)_?\*\*?/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getProducts(): Promise<ProductRecord[]> {
  const entries = await getCollection('products');

  return entries.map((entry) => {
    const category = categories.find((item) => item.productSlugs.includes(entry.id));
    if (!category) throw new Error(`Product has no live category mapping: ${entry.id}`);
    const slug = (productRoutes as Record<string, string>)[entry.id];
    if (!slug) throw new Error(`Product has no English route: ${entry.id}`);

    const assets = (
      productAssets as Record<string, { gallery: string[]; documents: { label: string; filename: string }[] }>
    )[entry.id];
    const galleryImages: ImageMetadata[] = [];
    if (assets?.gallery) {
      for (const filename of assets.gallery) {
        if (!validateAssetFilename(filename)) {
          throw new Error(`Invalid gallery filename for ${entry.id}: ${filename}`);
        }
        try {
          galleryImages.push(getProductImage(filename));
        } catch {
          console.warn(`Gallery image not found for ${entry.id}: ${filename}`);
        }
      }
    }
    if (galleryImages.length === 0) {
      galleryImages.push(getProductImage(entry.data.coverImage));
    }

    const documents = (assets?.documents ?? []).filter((doc) => {
      if (!validateAssetFilename(doc.filename)) {
        throw new Error(`Invalid document filename for ${entry.id}: ${doc.filename}`);
      }
      return true;
    });

    const copy = entry.data.description ?? plainText(entry.body ?? '');
    return {
      entry,
      slug,
      category,
      image: getProductImage(entry.data.coverImage),
      gallery: galleryImages,
      documents,
      excerpt: copy.length > 190 ? `${copy.slice(0, 187).trim()}...` : copy,
    };
  });
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductRecord[]> {
  const products = await getProducts();
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return [];

  return category.productSlugs
    .map((slug) => products.find((product) => product.entry.id === slug))
    .filter((product): product is ProductRecord => Boolean(product));
}
