import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product categorization map based on keywords
const categoryMap = {
  'power-amplifiers': ['усилител', 'um', 'линейный'],
  'frequency-converters': ['конвертор', 'bpr', 'преобразовател'],
  'signal-switches': ['коммутатор', 'переключател'],
  'redundancy-systems': ['резервиров', 'блок контроля', 'brg', 'brip', 'bks'],
  'signal-generators': ['генератор', 'bgi'],
  'antenna-elements': [
    'volnovod',
    'волновод',
    'нагрузка',
    'splitter',
    'сплиттер',
    'adapter',
    'адаптер',
    'кабел',
    'фидер',
    'vstavka',
    'вставка',
  ],
};

// Map Russian category names to directory names
const categoryNameMap = {
  'power-amplifiers': 'Усилители мощности',
  'frequency-converters': 'Преобразователи частоты',
  'signal-switches': 'Коммутаторы сигналов',
  'redundancy-systems': 'Системы резервирования 1:1',
  'signal-generators': 'Генераторы сигналов',
  'antenna-elements': 'Элементы антенно-волноводного тракта',
};

// Categorize product based on filename and title
function categorizeProduct(filename, title) {
  const searchText = (filename + ' ' + title).toLowerCase();

  for (const [category, keywords] of Object.entries(categoryMap)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return category;
      }
    }
  }

  return 'antenna-elements'; // default category
}

// Read all product files from wp_export
const catalogDir = path.join(__dirname, '../wp_export/custom/catalog');
const files = fs.readdirSync(catalogDir).filter((f) => f.endsWith('.md'));

console.log(`Found ${files.length} product files to migrate\n`);

const categoryCounts = {};

files.forEach((file) => {
  const content = fs.readFileSync(path.join(catalogDir, file), 'utf-8');

  // Parse frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return;

  const frontmatter = match[1];
  const body = match[2].trim();

  // Extract fields
  const titleMatch = frontmatter.match(/title:\s*"([^"]*)"/);
  const dateMatch = frontmatter.match(/date:\s*(.+)/);
  const imageMatch = frontmatter.match(/coverImage:\s*"([^"]*)"/);

  if (!titleMatch) return;

  const title = titleMatch[1];
  const date = dateMatch ? dateMatch[1] : '2023-01-01';
  const image = imageMatch ? imageMatch[1] : '';

  // Categorize
  const category = categorizeProduct(file, title);
  categoryCounts[category] = (categoryCounts[category] || 0) + 1;

  // Create new filename (slug from original)
  const slug = file.replace('.md', '');

  // Extract excerpt (first sentence or paragraph)
  const firstParagraph = body.split('\n\n')[0];
  const excerpt = firstParagraph.substring(0, 200).replace(/\\/g, '');

  // Check for delivery terms
  const deliveryMatch = body.match(/\*\*_Условия поставки:_\*\*\s*(.+)/);
  const leadTime = deliveryMatch ? deliveryMatch[1].trim() : '';

  // Create new frontmatter for Astro
  const newFrontmatter = `---
publishDate: ${date}T00:00:00Z
title: "${title}"
excerpt: "${excerpt.replace(/"/g, '\\"')}..."
category: ${category}
image: ~/assets/images/products/${image}
${
  leadTime
    ? `leadTime: "${leadTime.replace(/"/g, '\\"')}"
`
    : ''
}metadata:
  title: "${title} | MW-Lab"
  description: "${excerpt.replace(/"/g, '\\"')}..."
---

${body}
`;

  // Write to appropriate category directory
  const outputPath = path.join(__dirname, `../src/data/product/${category}/${slug}.md`);
  fs.writeFileSync(outputPath, newFrontmatter);

  console.log(`✓ Migrated: ${title} -> ${category}/${slug}.md`);
});

console.log('\n=== Migration Summary ===');
console.log('Products by category:');
Object.entries(categoryCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([cat, count]) => {
    console.log(`  ${categoryNameMap[cat]}: ${count}`);
  });
console.log(`\nTotal: ${files.length} products migrated`);
