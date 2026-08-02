# WordPress To Astro Migration

## Current State

The old AstroWind attempt was removed. The new site is a minimal static Astro application built around the live WordPress information architecture.

Migrated:

- Homepage copy and company positioning.
- Six product categories from the live taxonomy.
- All 43 product titles, slugs, dates, primary images, descriptions, and supply conditions.
- Ten publication titles, dates, covers, and external reader destinations.
- Current public phone, email, and contact address.
- A site-specific privacy-policy draft.
- Current company-card PDF.
- English canonical paths with permanent redirects from the legacy WordPress URLs.

Not inferred or fabricated:

- Product documents. The previous Astro attempt generated 50 fake PDF links; none were retained.
- Product specifications. The previous attempt generated fields with regular expressions and produced incorrect values; the original prose remains authoritative.
- English content. The live `eng` control points to `#` and there is no English site.

## Architecture

Astro generates static HTML for every public route. Imported WordPress Markdown remains the product-content source; `src/lib/catalog.ts` supplies taxonomy and ordering, while `src/data/product-routes.json` defines the reviewed English product URLs.

The public route strategy uses concise English URLs while preserving the WordPress addresses as permanent redirects:

- `/catalog/` remains the catalog archive.
- `/catalog/<english-product-slug>/` serves every product path.
- `/products/<english-category>/` serves every category path.
- `/publications/`, `/contact/`, and `/privacy-policy/` serve company pages.
- English publication detail URLs redirect directly to their real external Groteck readers instead of serving empty templates.
- Every replaced WordPress URL has a permanent Netlify redirect to its English replacement or verified external reader.

This protects existing search results and bookmarks while exposing only English canonical links in the new site.

## Design Direction

The design uses an RF-instrument visual language rather than a general-purpose startup template:

- Geologica for display headings, Onest for body text, IBM Plex Mono for frequencies and utility labels.
- Deep navy/teal surfaces, a cyan accent aligned with the legacy logo, and a restrained violet secondary.
- A high-resolution transparent satellite-dish render, color-graded into the navy/cyan system instead of presenting a single catalog item as the company signature. Source and usage details are recorded in `ASSET-CREDITS.md`.
- Original equipment photography in pale instrument-blue "inspection trays," with source-image edges faded into the field instead of exposed as white rectangles.
- Company metrics derived from catalog data (product count, category count, years since 2012) instead of hard-coded legacy counters.

Responsive styles cover desktop, tablet, and mobile; keyboard focus and reduced-motion preferences are supported.

## Decisions Before Production

### 1. Privacy Policy

The WordPress boilerplate (Gravatar, comments, accounts, login cookies, `Предлагаемый текст`) has been replaced with a site-specific draft that describes only the actual data flow: phone and email contact, no cookies, no analytics, no accounts.

The draft is written in plain language but has not been reviewed by a lawyer. Obtain approved legal wording before launch; the page structure makes substitution a single-file change in `src/content/pages/privacy-policy.md`.

### 2. Product Galleries And Documents

The live WordPress pages reference product images and PDFs. A per-product manifest at `src/data/product-assets.json` maps each product to its gallery images and downloadable documents. Gallery images are stored in `src/assets/images/products/` and PDFs in `public/downloads/products/`. This manifest was scraped from the live site and should be reviewed for accuracy before launch.

### 4. Business Facts

Confirm the public address, legal address, lead times, stock statements, company age, and support claims. They are preserved from the live site/product content and may be stale.

The unverifiable legacy counters (`28`, `11`, `83`) were removed from the homepage: product and category counts are now derived from `src/lib/catalog.ts`, and company age is computed from 2012. Product pages carry an explicit "уточняйте при запросе" note because warehouse-quantity statements originate from 2023 WordPress content. The portfolio range is presented as 400 МГц – 15 ГГц / 1 Вт – 100 Вт, matching the amplifier category description; confirm it against current production before launch.

## Review And Cutover

1. Run `npm run verify`.
2. Run `npm run dev` and review `/`, `/catalog/`, one page from each category, `/publications/`, `/contact/`, and `/privacy-policy/` at desktop and phone widths.
3. Approve the legal policy.
4. Crawl the preview and compare all legacy sitemap URLs against the new deployment.
5. Back up the WordPress database and full `wp-content/uploads` directory.
6. Lower DNS TTL at least 24 hours before cutover.
7. Deploy the static site, attach `mw-lab.ru`, and enforce HTTPS plus the non-`www` canonical host.
8. Re-submit `https://mw-lab.ru/sitemap-index.xml` in search tools.
9. Monitor 404s and search coverage for at least two weeks before deleting the WordPress server.

## Rollback

Keep the WordPress host intact during the monitoring window. A rollback is a DNS or reverse-proxy switch back to WordPress; do not destroy the database/uploads backup until the static site has been stable for at least two weeks.
