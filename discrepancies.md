# Migration Discrepancies: mw-lab.ru → Astro Site

This document tracks discrepancies found between the original mw-lab.ru WordPress site and the migrated Astro version.

## ✅ FIXED Issues

### 1. Home Page Hero Image
**Status:** ✅ **FIXED**

**Issue:** Used product photo instead of abstract hero image

**Fix:** Updated to use `~/assets/images/hero-image.png` (abstract artistic design)

**File:** `src/pages/index.astro:38`

---

### 2. Home Page Headline/Tagline
**Status:** ✅ **FIXED**

**Issue:** Different headline and overly verbose tagline

**Fix:**
- Headline: "Разработчик и поставщик оборудования спутниковой связи"
- Tagline: "Адаптивные решения для профессиональной связи"

**File:** `src/pages/index.astro:42-51`

---

### 3. Statistics Numbers
**Status:** ✅ **FIXED**

**Issue:** Numbers didn't match original site

**Fix:** Updated to match original:
- 11 years (was 10+)
- 83 projects (was 83+)
- 28 products (was 43)
- 6 categories (unchanged)

**File:** `src/pages/index.astro:57-62`

---

### 4. Blog Post External Links
**Status:** ✅ **FIXED**

**Issue:** Blog posts linked to cs.groteck.ru homepage instead of specific articles

**Important Discovery:** The original mw-lab.ru site ALSO uses external links to cs.groteck.ru for blog content. The migration was architecturally correct, but used wrong URLs.

**Fix:** Updated all blog posts with correct specific URLs:
- Спутниковая связь и вещание 2025 → `https://cs.groteck.ru/SATCOM_2025/index.html`
- Модернизация ПССС Drive Away → `https://cs.groteck.ru/SATCOM_2025/68/index.html`
- Новые продукты 2025 → `https://cs.groteck.ru/SATCOM_2025/104/index.html`
- Спутниковая связь и вещание 2024 → `http://cs.groteck.ru/SATCOM_2024/index.html`
- Продукция собственной разработки → `http://cs.groteck.ru/SATCOM_2024/85/index.html`
- Новые продукты 2024 → `http://cs.groteck.ru/SATCOM_2024/117/index.html`
- Спутниковая связь и вещание 2023 → `http://cs.groteck.ru/SATCOM_2023/index.html`
- Модернизация передвижных станций → `http://cs.groteck.ru/SATCOM_2023/54/index.html`
- Многоспутниковые системы связи → `http://cs.groteck.ru/SATCOM_2023/76/index.html`

**Files:** All files in `src/data/post/`

---

## Remaining Minor Issues

### 5. Call-to-Action Buttons
**Status:** ⚠️ **Minor Difference** (Not necessarily wrong)

**Original (mw-lab.ru):**
- Primary CTA: "Узнать подробнее" (Learn more)

**Migrated:**
- Primary CTA: "Смотреть продукцию" (View products)
- Secondary CTA: "Связаться с нами" (Contact us)

**Impact:** Low - The migrated version actually provides clearer action paths with two distinct CTAs. This could be considered an improvement.

---

## What Migrated Successfully ✅

### Products
- Product pages migrated successfully with complete content
- All specifications, descriptions, and technical details preserved
- Example: УМ2021-100, БПР0917-1314ОГ contain full original content
- Product images properly imported to `src/assets/images/products/`
- Document references maintained (passports, datasheets)

### Site Structure
- Navigation structure preserved
- Product categories organized correctly
- Footer information maintained
- Metadata and SEO tags properly implemented

### Blog Architecture
- Correctly replicated the original external link structure to cs.groteck.ru
- Publication images migrated successfully
- File naming conventions maintained

### Visual Assets
- Product images successfully migrated
- Publication images migrated
- Hero image properly migrated (now in use after fix)

---

## Final Summary

**Overall Migration Quality:** ✅ **Excellent**

All critical issues have been resolved:
- ✅ Hero image now uses the correct abstract design
- ✅ Homepage headline and tagline match the original
- ✅ Statistics numbers corrected to match original (11 years, 83 projects, 28 products)
- ✅ Blog post links now point to correct specific articles on cs.groteck.ru

The migration successfully captured:
- Complete product catalog with all specifications
- Correct site structure and navigation
- Proper external linking for blog content (matching original architecture)
- All visual assets and branding elements

**Dev server running at:** http://localhost:4321/
