/**
 * Phase 3: Product Enhancement Script
 *
 * This script enhances product markdown files with:
 * - Product codes
 * - Detailed specifications
 * - Gallery images
 * - Document links (placeholders for now)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Check if additional gallery images exist for this product
async function findGalleryImages(productSlug) {
  const wpExportImagesDir = path.join(ROOT_DIR, 'wp_export/custom/catalog/images');
  const galleries = [];

  try {
    const files = await fs.readdir(wpExportImagesDir);
    const productImages = files.filter(f =>
      f.startsWith(productSlug) &&
      !f.includes('scaled') && // Skip scaled versions
      (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg'))
    );

    // Copy to assets and return paths
    for (const img of productImages) {
      const srcPath = path.join(wpExportImagesDir, img);
      const destPath = path.join(ROOT_DIR, 'src/assets/images/products', img);

      try {
        await fs.copyFile(srcPath, destPath);
        galleries.push(`~/assets/images/products/${img}`);
      } catch {
        // Image might already exist, that's OK
      }
    }
  } catch {
    // Directory might not exist
  }

  return galleries;
}

// Extract specifications from product description
function extractSpecifications(content) {
  const specs = {};

  // Extract weight
  const weightMatch = content.match(/Масса[^:]*:\s*([^.]+)/i);
  if (weightMatch) {
    specs.weight = weightMatch[1].trim();
  }

  // Extract protection class
  const protectionMatch = content.match(/IP\s*\d+/i);
  if (protectionMatch) {
    specs.protection = protectionMatch[0];
  }

  // Extract power supply
  const powerMatch = content.match(/220\s*В[^.]+/);
  if (powerMatch) {
    specs.powerSupply = powerMatch[0].trim();
  }

  // Extract interface
  const interfaceMatch = content.match(/RS\s*\d+[^.]+/i);
  if (interfaceMatch) {
    specs.interface = interfaceMatch[0].trim();
  }

  // Frequency band based on product code/content
  if (content.includes('S-диапазон') || content.includes('S-band')) {
    specs.frequency = 'S-диапазон';
  } else if (content.includes('C-диапазон') || content.includes('C-band')) {
    specs.frequency = 'C-диапазон';
  } else if (content.includes('Ku-диапазон') || content.includes('Ku-band')) {
    specs.frequency = 'Ku-диапазон';
  } else if (content.includes('Ka-диапазон') || content.includes('Ka-band')) {
    specs.frequency = 'Ka-диапазон';
  }

  return Object.keys(specs).length > 0 ? specs : null;
}

// Extract product code from title
function extractProductCode(title) {
  // Match patterns like УМ2021-100, БПР0915-7884, etc.
  const codeMatch = title.match(/([А-Я]{2,4}[\d-]+[\w]*)/);
  return codeMatch ? codeMatch[1] : null;
}

// Create document placeholders
function createDocumentLinks(productCode) {
  if (!productCode) return null;

  return [
    {
      title: 'Паспорт изделия',
      url: `/documents/passports/${productCode.toLowerCase()}-passport.pdf`,
      type: 'passport'
    },
    {
      title: 'Чертеж изделия',
      url: `/documents/datasheets/${productCode.toLowerCase()}-drawing.pdf`,
      type: 'datasheet'
    }
  ];
}

// Process a single product file
async function enhanceProduct(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Skip if already enhanced (has productCode)
    if (content.includes('productCode:')) {
      console.log(`⏭️  Skipped (already enhanced): ${path.basename(filePath)}`);
      return { enhanced: false };
    }

    // Parse frontmatter
    const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
    if (!match) {
      console.log(`⚠️  Skipped (no frontmatter): ${path.basename(filePath)}`);
      return { enhanced: false };
    }

    const [, frontmatterStr, bodyContent] = match;
    const frontmatter = {};

    // Parse existing frontmatter
    frontmatterStr.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
      }
    });

    const productSlug = path.basename(filePath, '.md');
    const productCode = extractProductCode(frontmatter.title || '');
    const specifications = extractSpecifications(bodyContent);
    const gallery = await findGalleryImages(productSlug);
    const documents = createDocumentLinks(productCode);

    // Build enhanced frontmatter
    const lines = frontmatterStr.split('\n');
    const newLines = [];

    // Add existing lines until we hit metadata
    for (const line of lines) {
      newLines.push(line);
      if (line.startsWith('leadTime:')) {
        // Add new fields after leadTime
        if (productCode) {
          newLines.push(`productCode: "${productCode}"`);
        }

        if (specifications) {
          newLines.push('specifications:');
          if (specifications.frequency) newLines.push(`  frequency: "${specifications.frequency}"`);
          if (specifications.power) newLines.push(`  power: "${specifications.power}"`);
          if (specifications.weight) newLines.push(`  weight: "${specifications.weight}"`);
          if (specifications.protection) newLines.push(`  protection: "${specifications.protection}"`);
          if (specifications.powerSupply) newLines.push(`  powerSupply: "${specifications.powerSupply}"`);
          if (specifications.interface) newLines.push(`  interface: "${specifications.interface}"`);
        }

        if (gallery && gallery.length > 0) {
          newLines.push('gallery:');
          gallery.forEach(img => newLines.push(`  - ${img}`));
        }

        if (documents && documents.length > 0) {
          newLines.push('documents:');
          documents.forEach(doc => {
            newLines.push(`  - title: "${doc.title}"`);
            newLines.push(`    url: "${doc.url}"`);
            newLines.push(`    type: "${doc.type}"`);
          });
        }
      }
    }

    // Write enhanced file
    const enhancedContent = `---\n${newLines.join('\n')}\n---\n${bodyContent}`;
    await fs.writeFile(filePath, enhancedContent, 'utf-8');

    console.log(`✅ Enhanced: ${path.basename(filePath)}`);
    console.log(`   Code: ${productCode || 'N/A'} | Specs: ${specifications ? 'Yes' : 'No'} | Gallery: ${gallery.length} images`);

    return {
      enhanced: true,
      productCode,
      specsAdded: !!specifications,
      galleryCount: gallery.length,
      docsAdded: !!documents
    };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { enhanced: false, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('🚀 Phase 3: Product Enhancement Script\n');

  const productDir = path.join(ROOT_DIR, 'src/data/product');
  const categories = await fs.readdir(productDir);

  let total = 0;
  let enhanced = 0;
  let skipped = 0;
  let errors = 0;

  for (const category of categories) {
    const categoryPath = path.join(productDir, category);
    const stat = await fs.stat(categoryPath);

    if (!stat.isDirectory()) continue;

    console.log(`\n📁 Category: ${category}`);

    const files = await fs.readdir(categoryPath);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    for (const file of mdFiles) {
      total++;
      const filePath = path.join(categoryPath, file);
      const result = await enhanceProduct(filePath);

      if (result.enhanced) {
        enhanced++;
      } else if (result.error) {
        errors++;
      } else {
        skipped++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Enhancement Summary:');
  console.log(`   Total products: ${total}`);
  console.log(`   ✅ Enhanced: ${enhanced}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(60));

  if (enhanced > 0) {
    console.log('\n✨ Products enhanced! Run `npm run build` to regenerate pages.');
  }
}

main().catch(console.error);
