# WordPress to Astro Migration Plan
## MW-Lab.ru (Лаборатория Микроволн)

**Migration Date:** December 11, 2025
**Current Site:** https://mw-lab.ru (WordPress)
**Target Framework:** Astro 5.0 (AstroWind Template)
**Primary Language:** Russian (with English support)

---

## Executive Summary

This document outlines the complete migration strategy for transitioning the MW-Lab.ru website from WordPress to Astro framework. The site is a professional satellite communication equipment manufacturer's website featuring a product catalog, publications/blog, and corporate information pages.

### Migration Scope

- **6 Product Categories** with ~28 individual products
- **9+ Blog/Publication Posts** (paginated)
- **5+ Static Pages** (Home, Contact, About, Terms, Privacy)
- **Bilingual Support** (Russian primary, English secondary)
- **Media Library** (product images, technical documents, downloadables)
- **Contact Forms** and callback functionality

---

## Phase 1: Pre-Migration Setup & Analysis

### 1.1 Content Audit & Export

**WordPress Export:**
```bash
# From WordPress Admin Dashboard:
# Tools > Export > All Content > Download Export File
# This creates an XML file with all posts, pages, categories, tags, and metadata
```

**Export Required Data:**
- [ ] WordPress XML export file (posts, pages, custom post types)
- [ ] Media library (download all images via FTP/cPanel or plugin like "All-in-One WP Migration")
- [ ] Product data (if using WooCommerce or custom post type)
- [ ] Custom fields/metadata (ACF or other custom fields)
- [ ] Taxonomies (categories, tags, product categories)
- [ ] Navigation menus structure
- [ ] Contact form configurations
- [ ] Theme settings and customizations

**Recommended Tools:**
- **WordPress Importer Plugin** - for data extraction
- **WP All Export** - for structured product data
- **Duplicator** or **All-in-One WP Migration** - for complete backup
- **wp2md** or **wordpress-to-hugo-exporter** - for markdown conversion

### 1.2 Current Astro Setup Analysis

**Existing Configuration:**
- ✅ Astro 5.12.9 with AstroWind template
- ✅ Tailwind CSS for styling
- ✅ MDX support for content
- ✅ Blog system with categories, tags, pagination
- ✅ SEO optimization (@astrolib/seo)
- ✅ Image optimization (unpic, sharp)
- ✅ Static site generation (SSG)
- ✅ RSS feed support
- ✅ Sitemap generation

**Required Modifications:**
- 🔧 Russian language configuration
- 🔧 Product catalog content collection
- 🔧 Custom product page layouts
- 🔧 Contact form integration
- 🔧 Navigation menu updates
- 🔧 Footer customization

---

## Phase 2: Content Structure Design

### 2.1 Content Collections Schema

**Create Product Collection:**

```typescript
// src/content/config.ts - ADD THIS
const productCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/product' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),

    // Product specific fields
    category: z.string(), // Product category
    productCode: z.string().optional(), // e.g., "УМ2021-100"

    // Technical specifications
    specifications: z.object({
      frequency: z.string().optional(),
      power: z.string().optional(),
      weight: z.string().optional(),
      dimensions: z.string().optional(),
      protection: z.string().optional(), // IP rating
      powerSupply: z.string().optional(),
      interface: z.string().optional(),
    }).optional(),

    // Media
    image: z.string(),
    gallery: z.array(z.string()).optional(),

    // Documents
    documents: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.string(), // 'passport', 'datasheet', 'test-report', etc.
    })).optional(),

    // Status
    leadTime: z.string().optional(), // e.g., "16 weeks"
    inStock: z.boolean().optional(),
    featured: z.boolean().optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
  product: productCollection,
};
```

### 2.2 Content Directory Structure

```
src/
├── data/
│   ├── post/                          # Blog/Publications
│   │   ├── satellite-2025.md
│   │   ├── drive-away-modernization.md
│   │   └── new-products-2025.md
│   │
│   └── product/                       # Product Catalog
│       ├── antenna-elements/          # Category: Antenna-Waveguide Elements
│       │   ├── product-1.md
│       │   └── product-2.md
│       ├── power-amplifiers/          # Category: Power Amplifiers
│       │   ├── um2021-100.md
│       │   ├── um2424-60.md
│       │   └── um5860-2.md
│       ├── redundancy-systems/        # Category: Redundancy Systems 1:1
│       ├── frequency-converters/      # Category: Frequency Converters
│       ├── signal-switches/           # Category: Signal Switches
│       └── signal-generators/         # Category: Signal Generators
│
├── pages/
│   ├── index.astro                    # Homepage
│   ├── about.astro                    # About page
│   ├── contact.astro                  # Contact page
│   ├── terms.md                       # Terms of Service
│   ├── privacy.md                     # Privacy Policy
│   │
│   ├── [...blog]/                     # Blog/Publications
│   │   ├── index.astro
│   │   ├── [...page].astro
│   │   ├── [category]/[...page].astro
│   │   └── [tag]/[...page].astro
│   │
│   └── products/                      # Product Section
│       ├── index.astro                # All products listing
│       ├── [...page].astro            # Product pagination
│       ├── [category]/                # Category pages
│       │   ├── index.astro
│       │   └── [...page].astro
│       └── [slug].astro               # Individual product page
│
└── assets/
    └── images/
        ├── products/                   # Product images
        │   ├── um2021-100/
        │   │   ├── main.jpg
        │   │   └── gallery/
        │   └── ...
        └── publications/               # Blog post images
```

---

## Phase 3: Content Migration Process

### 3.1 Export WordPress Content

**Step 1: Export via WordPress Admin**
1. Login to WordPress admin panel
2. Navigate to Tools > Export
3. Select "All content" or specific content types
4. Download the XML file

**Step 2: Export Media Library**
```bash
# Option A: Via FTP/SFTP
# Download /wp-content/uploads/ directory

# Option B: Via WP-CLI (if available)
wp media regenerate --yes

# Option C: Use plugin like "All-in-One WP Migration"
```

**Step 3: Export Product Data**
- If using custom post types, export separately
- Use "WP All Export" plugin for structured CSV/JSON export
- Document custom fields mapping

### 3.2 Content Conversion Strategy

**Publications/Blog Posts:**

```bash
# Use wordpress-to-hugo-exporter or custom script
# Manual conversion template for each post:
```

```markdown
---
publishDate: 2025-01-15T00:00:00Z
title: "Спутниковая связь и вещание 2025"
excerpt: "Brief description of the publication"
image: ~/assets/images/publications/satellite-2025.jpg
category: Industry News
tags:
  - satellite
  - 2025
  - conference
author: MW-Lab Team
metadata:
  canonical: https://mw-lab.ru/publikatsii/satellite-2025/
---

[Content here in Markdown format]
```

**Product Pages:**

```markdown
---
title: "Усилитель мощности УМ2021-100"
excerpt: "Усиление СВЧ-сигналов S-диапазона"
description: "Двухмодульная конструкция с степенью защиты IP65..."
category: power-amplifiers
productCode: УМ2021-100

specifications:
  frequency: "S-band microwave signals"
  power: "100W output"
  weight: "18.5 kg (amplifier), 6.7 kg (PSU)"
  protection: "IP65"
  powerSupply: "220V AC, 50 Hz"
  interface: "RS485 modbus (РСГ7ТВ connector)"

image: ~/assets/images/products/um2021-100/main.jpg
gallery:
  - ~/assets/images/products/um2021-100/front.jpg
  - ~/assets/images/products/um2021-100/back.jpg
  - ~/assets/images/products/um2021-100/connectors.jpg

documents:
  - title: "Passport"
    url: "/documents/um2021-100-passport.pdf"
    type: "passport"
  - title: "Dimensional Drawing"
    url: "/documents/um2021-100-dimensions.pdf"
    type: "datasheet"
  - title: "RS485 Protocol"
    url: "/documents/um2021-100-protocol.pdf"
    type: "protocol"

leadTime: "16 weeks"
featured: true

metadata:
  title: "Усилитель мощности УМ2021-100 | MW-Lab"
  description: "Профессиональный усилитель мощности S-диапазона с выходной мощностью 100W"
---

## Описание

Двухмодульная конструкция усилителя мощности обеспечивает усиление СВЧ-сигналов S-диапазона...

## Технические характеристики

- Двойной герметичный внешний корпус со степенью защиты IP65
- Входные/выходные разъемы N-типа для СВЧ-сигналов S-диапазона
- Источник питания: 220V AC, 50 Hz через выделенный БП (C600-24)
- Интерфейс управления: RS485 modbus через разъем РСГ7ТВ

## LED индикация

Четыре операционных состояния индицируются цветными светодиодами...

[Additional content]
```

### 3.3 Media Migration

**Image Organization:**
```bash
# Create directory structure
mkdir -p public/images/products
mkdir -p public/images/publications
mkdir -p public/documents

# Copy WordPress uploads
# From: /wp-content/uploads/
# To: /public/images/ (organized by type)

# Optimize images
npm install -g sharp-cli
sharp-cli resize 1920 --input "*.jpg" --output optimized/
```

**Image Reference Updates:**
- Convert WordPress image URLs to Astro asset references
- Use Astro's `<Image />` component for optimization
- Update image paths in markdown files

**Document Storage:**
```bash
# Store PDFs and downloadables in public/documents
public/
└── documents/
    ├── passports/
    ├── datasheets/
    ├── protocols/
    └── certificates/
```

---

## Phase 4: Site Configuration

### 4.1 Update Site Configuration

**Update `src/config.yaml`:**

```yaml
site:
  name: Лаборатория Микроволн
  site: 'https://mw-lab.ru'
  base: '/'
  trailingSlash: false

metadata:
  title:
    default: Лаборатория Микроволн
    template: '%s | MW-Lab'
  description: "Разработчик и поставщик профессионального оборудования спутниковой связи. Более 10 лет опыта."
  robots:
    index: true
    follow: true
  openGraph:
    site_name: MW-Lab
    images:
      - url: '~/assets/images/og-image.jpg'
        width: 1200
        height: 628
    type: website
  twitter:
    handle: '@mwlab'
    site: '@mwlab'
    cardType: summary_large_image

i18n:
  language: ru
  textDirection: ltr

apps:
  blog:
    isEnabled: true
    postsPerPage: 9
    list:
      pathname: 'publikatsii' # Changed from 'blog' to match WordPress
    category:
      pathname: 'category'
    tag:
      pathname: 'tag'

  products:
    isEnabled: true
    productsPerPage: 12
    list:
      pathname: 'products' # or 'tovary' to match WordPress
    category:
      pathname: 'products/category'
```

### 4.2 Update Navigation

**Update `src/navigation.ts`:**

```typescript
export const headerData = {
  links: [
    {
      text: 'Главная',
      href: getPermalink('/'),
    },
    {
      text: 'Продукция',
      links: [
        {
          text: 'Все продукты',
          href: getPermalink('/products'),
        },
        {
          text: 'Элементы антенно-волноводного тракта',
          href: getPermalink('/products/category/antenna-elements'),
        },
        {
          text: 'Усилители мощности',
          href: getPermalink('/products/category/power-amplifiers'),
        },
        {
          text: 'Системы резервирования 1:1',
          href: getPermalink('/products/category/redundancy-systems'),
        },
        {
          text: 'Преобразователи частоты',
          href: getPermalink('/products/category/frequency-converters'),
        },
        {
          text: 'Коммутаторы сигналов',
          href: getPermalink('/products/category/signal-switches'),
        },
        {
          text: 'Генераторы сигналов',
          href: getPermalink('/products/category/signal-generators'),
        },
      ],
    },
    {
      text: 'Публикации',
      href: getPermalink('/publikatsii'),
    },
    {
      text: 'О компании',
      href: getPermalink('/about'),
    },
    {
      text: 'Контакты',
      href: getPermalink('/contact'),
    },
  ],
  actions: [
    {
      text: 'Заказать звонок',
      href: '#callback',
      variant: 'primary'
    }
  ],
};

export const footerData = {
  links: [
    {
      title: 'Продукция',
      links: [
        { text: 'Усилители мощности', href: '/products/category/power-amplifiers' },
        { text: 'Преобразователи частоты', href: '/products/category/frequency-converters' },
        { text: 'Коммутаторы сигналов', href: '/products/category/signal-switches' },
        { text: 'Системы резервирования', href: '/products/category/redundancy-systems' },
        { text: 'Генераторы сигналов', href: '/products/category/signal-generators' },
      ],
    },
    {
      title: 'Компания',
      links: [
        { text: 'О нас', href: '/about' },
        { text: 'Публикации', href: '/publikatsii' },
        { text: 'Контакты', href: '/contact' },
      ],
    },
    {
      title: 'Информация',
      links: [
        { text: 'Политика конфиденциальности', href: '/privacy' },
        { text: 'Условия использования', href: '/terms' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Условия использования', href: getPermalink('/terms') },
    { text: 'Политика конфиденциальности', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    // Add MW-Lab's actual social media links
    { ariaLabel: 'Email', icon: 'tabler:mail', href: 'mailto:info@mw-lab.ru' },
    // Add other social links as needed
  ],
  footNote: `
    © ${new Date().getFullYear()} Лаборатория Микроволн. Все права защищены.
  `,
};
```

---

## Phase 5: Component Development

### 5.1 Product Components

**Create Product Listing Component:**
```astro
<!-- src/components/products/ProductGrid.astro -->
---
import { Image } from 'astro:assets';
import Button from '~/components/ui/Button.astro';

interface Props {
  products: any[];
}

const { products } = Astro.props;
---

<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map((product) => (
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <a href={`/products/${product.slug}`}>
        <Image
          src={product.data.image}
          alt={product.data.title}
          width={400}
          height={300}
          class="w-full h-48 object-cover"
        />
      </a>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2">
          <a href={`/products/${product.slug}`} class="hover:text-primary">
            {product.data.title}
          </a>
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {product.data.excerpt}
        </p>
        {product.data.productCode && (
          <p class="text-sm text-gray-500 mb-4">
            Артикул: {product.data.productCode}
          </p>
        )}
        <Button href={`/products/${product.slug}`} variant="secondary">
          Подробнее
        </Button>
      </div>
    </div>
  ))}
</div>
```

**Create Product Detail Component:**
```astro
<!-- src/components/products/ProductDetail.astro -->
---
import { Image } from 'astro:assets';
import Button from '~/components/ui/Button.astro';

interface Props {
  product: any;
}

const { product } = Astro.props;
const { title, image, gallery, specifications, documents, description } = product.data;
---

<div class="max-w-6xl mx-auto">
  <!-- Product Header -->
  <div class="grid md:grid-cols-2 gap-8 mb-8">
    <!-- Image Gallery -->
    <div>
      <Image
        src={image}
        alt={title}
        width={600}
        height={450}
        class="w-full rounded-lg shadow-lg mb-4"
      />
      {gallery && (
        <div class="grid grid-cols-3 gap-2">
          {gallery.map((img) => (
            <Image
              src={img}
              alt={title}
              width={200}
              height={150}
              class="rounded cursor-pointer hover:opacity-75"
            />
          ))}
        </div>
      )}
    </div>

    <!-- Product Info -->
    <div>
      <h1 class="text-3xl font-bold mb-4">{title}</h1>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
        {description}
      </p>

      <!-- Specifications -->
      {specifications && (
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-3">Технические характеристики</h2>
          <dl class="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(specifications).map(([key, value]) => (
              value && (
                <>
                  <dt class="font-medium text-gray-600 dark:text-gray-400">
                    {key}:
                  </dt>
                  <dd class="text-gray-900 dark:text-gray-100">{value}</dd>
                </>
              )
            ))}
          </dl>
        </div>
      )}

      <!-- Documents -->
      {documents && documents.length > 0 && (
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-3">Документация</h2>
          <ul class="space-y-2">
            {documents.map((doc) => (
              <li>
                <a
                  href={doc.url}
                  download
                  class="text-primary hover:underline flex items-center"
                >
                  <Icon name="tabler:file-download" class="w-5 h-5 mr-2" />
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <!-- CTA -->
      <div class="flex gap-4">
        <Button href="#contact" variant="primary">
          Запросить предложение
        </Button>
        <Button href="#callback" variant="secondary">
          Заказать звонок
        </Button>
      </div>
    </div>
  </div>

  <!-- Full Description -->
  <div class="prose dark:prose-invert max-w-none">
    <slot />
  </div>
</div>
```

### 5.2 Page Templates

**Product Category Page:**
```astro
<!-- src/pages/products/category/[category]/[...page].astro -->
---
import { getCollection } from 'astro:content';
import Layout from '~/layouts/PageLayout.astro';
import ProductGrid from '~/components/products/ProductGrid.astro';
import Pagination from '~/components/blog/Pagination.astro';

export async function getStaticPaths({ paginate }) {
  const products = await getCollection('product');

  const categories = [...new Set(products.map(p => p.data.category))];

  return categories.flatMap((category) => {
    const categoryProducts = products.filter(p => p.data.category === category);
    return paginate(categoryProducts, {
      params: { category },
      pageSize: 12,
    });
  });
}

const { page, category } = Astro.props;
const categoryTitles = {
  'power-amplifiers': 'Усилители мощности',
  'frequency-converters': 'Преобразователи частоты',
  // ... other categories
};

const metadata = {
  title: categoryTitles[category] || category,
  description: `Каталог продукции: ${categoryTitles[category]}`,
};
---

<Layout metadata={metadata}>
  <section class="py-12">
    <div class="container">
      <h1 class="text-4xl font-bold mb-8">{categoryTitles[category]}</h1>
      <ProductGrid products={page.data} />
      <Pagination page={page} />
    </div>
  </section>
</Layout>
```

**Individual Product Page:**
```astro
<!-- src/pages/products/[slug].astro -->
---
import { getCollection } from 'astro:content';
import Layout from '~/layouts/PageLayout.astro';
import ProductDetail from '~/components/products/ProductDetail.astro';

export async function getStaticPaths() {
  const products = await getCollection('product');
  return products.map((product) => ({
    params: { slug: product.slug },
    props: { product },
  }));
}

const { product } = Astro.props;
const { Content } = await product.render();

const metadata = {
  title: product.data.title,
  description: product.data.excerpt || product.data.description,
  openGraph: {
    images: [{ url: product.data.image }],
  },
};
---

<Layout metadata={metadata}>
  <article class="py-12">
    <div class="container">
      <ProductDetail product={product}>
        <Content />
      </ProductDetail>
    </div>
  </article>
</Layout>
```

### 5.3 Contact Form Integration

**Options for Contact Form:**

1. **Formspree** (Recommended for simplicity)
```astro
<!-- src/components/widgets/ContactForm.astro -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="Имя" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="tel" name="phone" placeholder="Телефон" />
  <textarea name="message" placeholder="Сообщение" required></textarea>
  <button type="submit">Отправить</button>
</form>
```

2. **Netlify Forms** (if hosting on Netlify)
```astro
<form name="contact" method="POST" data-netlify="true">
  <!-- form fields -->
</form>
```

3. **Custom API Route** (for more control)
```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  // Send email via SendGrid, Resend, or other service
  // ...
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
```

---

## Phase 6: Styling & Design

### 6.1 Russian Language Typography

**Update Tailwind Configuration:**

```javascript
// tailwind.config.cjs
module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter Variable',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
};
```

### 6.2 Design Customization

**Update Color Scheme (if needed):**
```css
/* src/assets/styles/tailwind.css */
:root {
  --color-primary: /* MW-Lab brand color */;
  --color-secondary: /* Secondary brand color */;
}
```

**Preserve WordPress Design Elements:**
- Extract color palette from current WordPress theme
- Match typography styles
- Maintain brand consistency
- Port custom CSS where necessary

---

## Phase 7: SEO & Performance

### 7.1 SEO Optimization

**Preserve WordPress URLs (301 Redirects):**

Create redirect rules for URL changes:

```javascript
// vercel.json (if using Vercel)
{
  "redirects": [
    {
      "source": "/tovary/:category*",
      "destination": "/products/category/:category*",
      "permanent": true
    },
    {
      "source": "/catalog/:slug*",
      "destination": "/products/:slug*",
      "permanent": true
    },
    {
      "source": "/publikatsii/:slug*",
      "destination": "/publikatsii/:slug*",
      "permanent": true
    },
    {
      "source": "/kontakty",
      "destination": "/contact",
      "permanent": true
    }
  ]
}
```

**Or use Netlify redirects:**
```
# public/_redirects
/tovary/*  /products/category/:splat  301
/catalog/*  /products/:splat  301
/kontakty  /contact  301
```

### 7.2 Performance Optimization

**Image Optimization:**
- Use Astro's `<Image />` component
- Convert images to WebP format
- Implement lazy loading
- Set appropriate sizes and formats

**Code Splitting:**
- Astro handles this automatically
- Ensure component lazy loading where appropriate

**Caching Strategy:**
```javascript
// astro.config.ts
export default defineConfig({
  // ...
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['lodash.merge', 'limax'],
          },
        },
      },
    },
  },
});
```

### 7.3 Sitemap & RSS

**Configure Sitemap:**
```yaml
# src/config.yaml
site:
  site: 'https://mw-lab.ru'
```

**Update RSS Feed:**
```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('post');
  const products = await getCollection('product');

  return rss({
    title: 'Лаборатория Микроволн',
    description: 'Новости и продукция компании MW-Lab',
    site: context.site,
    items: [
      ...posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.publishDate,
        link: `/publikatsii/${post.slug}/`,
      })),
      ...products.map((product) => ({
        title: product.data.title,
        description: product.data.excerpt,
        link: `/products/${product.slug}/`,
      })),
    ],
  });
}
```

---

## Phase 8: Testing & Quality Assurance

### 8.1 Content Verification Checklist

- [ ] All blog posts migrated and rendering correctly
- [ ] All product pages created with complete information
- [ ] All images displaying properly
- [ ] All internal links working
- [ ] All documents/downloads accessible
- [ ] Navigation menus functional
- [ ] Footer links operational
- [ ] Contact forms submitting successfully
- [ ] Search functionality (if applicable)

### 8.2 Technical Testing

**Local Testing:**
```bash
# Development server
npm run dev

# Production build test
npm run build
npm run preview
```

**Cross-Browser Testing:**
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

**Performance Testing:**
- Lighthouse audit (target: 90+ scores)
- WebPageTest
- GTmetrix

**SEO Testing:**
- Google Search Console verification
- Meta tags validation
- Structured data testing
- XML sitemap validation
- Robots.txt verification

### 8.3 Accessibility Testing

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Alt text for images

---

## Phase 9: Deployment

### 9.1 Pre-Deployment Checklist

- [ ] Update production domain in config
- [ ] Configure analytics (Google Analytics, Yandex Metrica for Russian market)
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure contact form service
- [ ] Test production build locally
- [ ] Create database backup of WordPress (final)
- [ ] Document any custom functionality

### 9.2 Deployment Options

**Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Option 2: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Option 3: Cloudflare Pages**
- Connect GitHub repository
- Configure build settings:
  - Build command: `npm run build`
  - Output directory: `dist`

**Option 4: Traditional Hosting (cPanel, VPS)**
```bash
# Build locally
npm run build

# Upload dist/ folder contents to server
# Configure web server (Nginx/Apache) for SPA routing
```

### 9.3 DNS Configuration

1. Update DNS records to point to new hosting
2. Configure SSL/TLS certificate
3. Set up CDN (Cloudflare) if needed
4. Configure email DNS records (MX, SPF, DKIM)

### 9.4 Go-Live Process

1. **Pre-launch:**
   - Deploy to staging environment
   - Final testing on staging
   - Get stakeholder approval

2. **Launch:**
   - Schedule maintenance window
   - Update DNS to point to new site
   - Monitor for issues

3. **Post-launch:**
   - Monitor analytics for traffic patterns
   - Check error logs
   - Monitor form submissions
   - Verify search engine indexing

---

## Phase 10: Post-Migration Tasks

### 10.1 Monitoring & Maintenance

**Setup Monitoring:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Performance monitoring (Google PageSpeed Insights)
- Analytics setup (Google Analytics, Yandex Metrica)
- Error tracking (Sentry)

### 10.2 SEO Preservation

- Submit updated sitemap to Google Search Console
- Submit to Yandex Webmaster Tools (important for Russian market)
- Monitor search rankings
- Check for crawl errors
- Update Google My Business (if applicable)

### 10.3 Content Management Plan

**Future Content Updates:**
```bash
# Adding new product
1. Create new .md file in src/data/product/[category]/
2. Add product images to src/assets/images/products/
3. Commit and push to git
4. Automatic deployment via CI/CD

# Adding new blog post
1. Create new .md file in src/data/post/
2. Add featured image
3. Commit and push
```

### 10.4 WordPress Decommissioning

**Timeline:**
- Keep WordPress site running for 30 days minimum
- Monitor redirect traffic and 404 errors
- Fix any broken redirects
- After 30 days of stable operation:
  - Create final WordPress backup
  - Archive WordPress database
  - Decommission WordPress hosting (optional)

---

## Phase 11: Bilingual Support (Russian/English)

### 11.1 i18n Implementation

**Install Astro i18n:**
```bash
npm install astro-i18next
```

**Configure i18n:**
```typescript
// astro-i18next.config.ts
export default {
  defaultLocale: "ru",
  locales: ["ru", "en"],
  routes: {
    ru: {
      'products': 'tovary',
      'publications': 'publikatsii',
      'contact': 'kontakty',
    },
    en: {
      'products': 'products',
      'publications': 'publications',
      'contact': 'contact',
    }
  }
};
```

### 11.2 Translation Structure

```
src/
└── locales/
    ├── ru/
    │   └── translation.json
    └── en/
        └── translation.json
```

---

## Timeline Estimate

| Phase | Tasks | Duration |
|-------|-------|----------|
| **Phase 1** | Pre-migration setup, content audit | 2-3 days |
| **Phase 2** | Content structure design | 1-2 days |
| **Phase 3** | Content migration & conversion | 5-7 days |
| **Phase 4** | Site configuration | 1-2 days |
| **Phase 5** | Component development | 3-5 days |
| **Phase 6** | Styling & design | 2-3 days |
| **Phase 7** | SEO & performance | 2-3 days |
| **Phase 8** | Testing & QA | 3-4 days |
| **Phase 9** | Deployment | 1-2 days |
| **Phase 10** | Post-migration | Ongoing |

**Total Estimated Time: 3-4 weeks**

---

## Risk Assessment & Mitigation

### Risks

1. **Data Loss During Migration**
   - Mitigation: Multiple backups, staged migration, content verification checklist

2. **SEO Ranking Drop**
   - Mitigation: Proper 301 redirects, maintain URL structure where possible, submit updated sitemap

3. **Broken Functionality**
   - Mitigation: Comprehensive testing, staging environment, gradual rollout

4. **Content Formatting Issues**
   - Mitigation: Manual review of converted content, test different content types

5. **Missing Images/Media**
   - Mitigation: Complete media audit before and after migration, automated link checking

### Rollback Plan

If critical issues arise:
1. Revert DNS to WordPress site
2. Investigate and fix issues on staging
3. Prepare for second deployment attempt

---

## Tools & Resources

### Migration Tools
- WordPress Export (built-in)
- wordpress-export-to-markdown
- wp2md
- All-in-One WP Migration plugin

### Development Tools
- VS Code with Astro extension
- Node.js 18.17.1+
- Git for version control

### Testing Tools
- Lighthouse
- GTmetrix
- Google Search Console
- Screaming Frog SEO Spider
- BrowserStack (cross-browser testing)

### Hosting Providers
- Vercel (recommended for Astro)
- Netlify
- Cloudflare Pages
- Traditional hosting with Node.js support

---

## Success Metrics

Post-migration KPIs to monitor:

1. **Performance**
   - Lighthouse score: Target 90+
   - Page load time: < 2 seconds
   - Time to Interactive: < 3 seconds

2. **SEO**
   - Maintain or improve search rankings
   - No increase in 404 errors
   - Proper indexing of all pages

3. **User Experience**
   - Bounce rate maintained or improved
   - Average session duration maintained
   - Form submission rate maintained

4. **Technical**
   - Zero critical errors
   - Successful builds and deployments
   - Uptime > 99.9%

---

## Contact & Support

For questions during migration:
- Technical lead: [Assign person]
- Content manager: [Assign person]
- Stakeholder: [Assign person]

---

## Appendix

### A. WordPress Content Structure (Discovered)

**Pages:**
- Главная (Home) - /
- Продукция (Products) - /tovary/
- Публикации (Publications) - /publikatsii/
- Контакты (Contacts) - /kontakty/
- (Assumed) О компании (About)
- (Assumed) Privacy Policy
- (Assumed) Terms of Service

**Product Categories (6):**
1. Элементы антенно-волноводного тракта (Antenna-Waveguide Elements)
2. Усилители мощности (Power Amplifiers) - ~8 products
3. Системы резервирования 1:1 (Redundancy Systems 1:1)
4. Преобразователи частоты (Frequency Converters)
5. Коммутаторы сигналов (Signal Switches)
6. Генераторы сигналов (Signal Generators)

**Sample Products:**
- УМ2021-100Р (Redundant Power Amplifier)
- УМ2424-60 (Power Amplifier)
- УМ5860-2 (Power Amplifier)
- БПР0917-1314/40 (Power Amplifier with Converter)
- And more...

**Publications (9+ identified):**
1. Спутниковая связь и вещание 2025
2. Модернизация ПССС Drive Away
3. Новые продукты 2025
4. Спутниковая связь и вещание 2024
5. Продукция собственной разработки
6. Новые продукты 2024
7. Спутниковая связь и вещание 2023
8. Модернизация передвижных станций
9. Многоспутниковые системы связи

### B. Technical Specifications

**Current Astro Setup:**
- Astro: 5.12.9
- Node.js: 18.17.1+
- Tailwind CSS: 3.4.17
- TypeScript: 5.8.3
- MDX Support: Yes
- Image Optimization: Sharp 0.34.3

**Required Integrations:**
- Sitemap: @astrojs/sitemap
- SEO: @astrolib/seo
- Analytics: @astrolib/analytics
- Icons: astro-icon
- Compression: astro-compress

### C. Additional Notes

- WordPress site is currently Russian-only with English language toggle
- Contact information: info@mw-lab.ru
- Company address: 124460, Москва, Зеленоград, ул. Конструктора Гуськова, дом 8
- Company has been in operation for 11+ years
- 28 products across 6 categories
- 83 completed projects (per homepage stats)
- Publications hosted externally on cs.groteck.ru

---

**Document Version:** 1.0
**Last Updated:** December 11, 2025
**Status:** Ready for Review and Implementation
