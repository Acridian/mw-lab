# Лаборатория Микроволн

Static Astro site migrated from `https://mw-lab.ru`.

## Commands

```sh
npm install
npm run dev
npm run check
npm run verify
```

`npm run verify` type-checks, builds, checks all product outputs and legacy routes, validates publication redirects, search metadata, and the company PDF, and rejects old template strings and fake document links.

## Content

- `src/content/products/`: product Markdown from the WordPress export.
- `src/content/publications/`: publication records from the WordPress export.
- `src/lib/catalog.ts`: taxonomy mapping and product order.
- `src/lib/publications.ts`: external publication-reader destinations.
- `src/assets/images/products/`: product media archive.
- `src/assets/images/publications/`: publication covers.
- `src/data/company.json`: central company info (phone, email, address).
- `ASSET-CREDITS.md`: provenance and reuse terms for third-party visual assets.

Do not rewrite imported Markdown as part of visual work. Make approved copy corrections as separate, reviewable changes.
