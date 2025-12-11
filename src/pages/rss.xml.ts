import { getRssString } from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { SITE, METADATA, APP_BLOG } from 'astrowind:config';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts();

  // Get products for RSS feed
  const products = await getCollection('product', ({ data }) => {
    return data.draft !== true;
  });

  // Combine posts and products
  const allItems = [
    ...posts.map((post) => ({
      link: getPermalink(post.permalink, 'post'),
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishDate,
    })),
    ...products.map((product) => ({
      link: `/products/${product.id}`,
      title: product.data.title,
      description: product.data.excerpt || product.data.description || '',
      pubDate: product.data.publishDate || new Date(),
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  const rss = await getRssString({
    title: `Лаборатория Микроволн - Публикации и продукция`,
    description: METADATA?.description || '',
    site: import.meta.env.SITE,
    items: allItems,
    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
