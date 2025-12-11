import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const productCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: 'src/data/product' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),

    // Product specific fields
    category: z.string(), // Product category
    productCode: z.string().optional(), // e.g., "УМ2021-100"

    // Technical specifications
    specifications: z
      .object({
        frequency: z.string().optional(),
        power: z.string().optional(),
        weight: z.string().optional(),
        dimensions: z.string().optional(),
        protection: z.string().optional(), // IP rating
        powerSupply: z.string().optional(),
        interface: z.string().optional(),
      })
      .optional(),

    // Media
    image: z.string(),
    gallery: z.array(z.string()).optional(),

    // Documents
    documents: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          type: z.string(), // 'passport', 'datasheet', 'test-report', etc.
        })
      )
      .optional(),

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
