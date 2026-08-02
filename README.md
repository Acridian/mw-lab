# Лаборатория микроволн

Static Astro site migrated from `https://mw-lab.ru`.

## Commands

```sh
npm install
npm run dev
npm run check
npm run verify
```

`npm run verify` type-checks, builds, checks all 43 product outputs and primary legacy routes, rejects old template strings and fake document links, and confirms the company PDF is published.

## Content

- `src/content/products/`: untouched product Markdown from the WordPress export.
- `src/content/publications/`: untouched publication records from the WordPress export.
- `src/lib/catalog.ts`: live WordPress taxonomy mapping and product order.
- `src/lib/publications.ts`: external publication-reader destinations.
- `src/assets/images/products/`: original WordPress product media archive.
- `src/assets/images/publications/`: original publication covers.
- `ASSET-CREDITS.md`: provenance and reuse terms for third-party visual assets.

Do not rewrite imported Markdown as part of visual work. Make approved copy corrections as separate, reviewable changes.

## Forms

The contact form uses Netlify Forms. It works after a Netlify deploy and appears as the `contact` form in the Netlify dashboard. For another host, replace the form transport before DNS cutover; see `MIGRATION.md`.
