# WordPress To Astro Migration

## Current State

The old AstroWind attempt was removed. The new site is a minimal static Astro application built around the live WordPress information architecture.

Migrated:

- Homepage copy and company positioning.
- Six product categories from the live taxonomy.
- All 43 product titles, slugs, dates, primary images, descriptions, and supply conditions.
- Ten publication titles, dates, covers, and external reader destinations.
- Current public phone, email, and contact address.
- A site-specific privacy-policy draft describing the current form flow.
- Current company-card PDF.
- Existing canonical product, category, publication, contact, and legal paths.

Not inferred or fabricated:

- Product documents. The previous Astro attempt generated 50 fake PDF links; none were retained.
- Product specifications. The previous attempt generated fields with regular expressions and produced incorrect values; the original prose remains authoritative.
- English content. The live `eng` control points to `#` and there is no English site.

## Architecture

Astro generates static HTML for every public route. Imported WordPress Markdown is immutable source material; `src/lib/catalog.ts` supplies only taxonomy and ordering that were verified against the live site.

The route strategy is intentionally conservative:

- `/catalog/` remains the catalog archive.
- `/catalog/<legacy-slug>/` remains every product path.
- `/tovary/<legacy-category>/` remains every category path.
- `/publikatsii/`, `/kontakty/`, and `/privacy-policy/` remain unchanged.
- Legacy publication detail URLs redirect directly to their real external Groteck readers instead of serving empty WordPress templates.

This avoids a large redirect migration and protects existing search results and bookmarks.

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

The WordPress boilerplate (Gravatar, comments, accounts, login cookies, `Предлагаемый текст`) has been replaced with a site-specific draft that describes only the actual data flow: the contact form (name, phone, email, message), no cookies, no analytics, no accounts.

The draft is written in plain language but has not been reviewed by a lawyer. Obtain approved legal wording before launch; the page structure makes substitution a single-file change in `src/content/pages/privacy-policy.md`.

### 2. Form Delivery

The current implementation uses Netlify Forms with required name, phone, and consent fields. It preserves the visible Contact Form 7 field set and sends users to `/spasibo/` after successful submission.

If hosting on Netlify:

1. Deploy a preview.
2. Confirm the `contact` form appears in the Netlify dashboard.
3. Configure notifications to `info@mw-lab.ru`.
4. Submit test data and verify delivery, spam handling, and consent capture.

If hosting on a VPS, Vercel, Cloudflare, or another platform, replace Netlify Forms with an approved serverless endpoint or mail provider. Do not launch with an untested form.

### 3. Product Galleries And Documents

The export contains 120 product images. The initial build uses the verified primary image for every product and keeps the remaining source files available for a reviewed gallery-mapping pass.

The live WordPress pages reference product PDFs and some third-party media that were not present in the repository export. Before WordPress is retired:

1. Export the WordPress uploads directory or retrieve the 71 real PDF targets from the live pages.
2. Create an approved product-to-gallery/document manifest.
3. Verify image ownership for third-party manufacturers.
4. Add only files whose product association is certain.

### 4. Business Facts

Confirm the public address, legal address, lead times, stock statements, company age, and support claims. They are preserved from the live site/product content and may be stale.

The unverifiable legacy counters (`28`, `11`, `83`) were removed from the homepage: product and category counts are now derived from `src/lib/catalog.ts`, and company age is computed from 2012. Product pages carry an explicit "уточняйте при запросе" note because warehouse-quantity statements originate from 2023 WordPress content. The portfolio range is presented as 400 МГц – 15 ГГц / 1 Вт – 100 Вт, matching the amplifier category description; confirm it against current production before launch.

## Review And Cutover

1. Run `npm run verify`.
2. Run `npm run dev` and review `/`, `/catalog/`, one page from each category, `/publikatsii/`, `/kontakty/`, and `/privacy-policy/` at desktop and phone widths.
3. Approve the legal policy and form transport.
4. Test form delivery in the final hosting environment.
5. Crawl the preview and compare all legacy sitemap URLs against the new deployment.
6. Back up the WordPress database and full `wp-content/uploads` directory.
7. Lower DNS TTL at least 24 hours before cutover.
8. Deploy the static site, attach `mw-lab.ru`, and enforce HTTPS plus the non-`www` canonical host.
9. Re-submit `https://mw-lab.ru/sitemap-index.xml` in search tools.
10. Monitor 404s, form submissions, and search coverage for at least two weeks before deleting the WordPress server.

## Rollback

Keep the WordPress host intact during the monitoring window. A rollback is a DNS or reverse-proxy switch back to WordPress; do not destroy the database/uploads backup until the static site and form have been stable for at least two weeks.
