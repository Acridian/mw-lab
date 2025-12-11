import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all post files from wp_export
const postsDir = path.join(__dirname, '../wp_export/posts');
const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

console.log(`Found ${files.length} post files to migrate\n`);

files.forEach((file) => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');

  // Parse frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return;

  const frontmatter = match[1];
  const body = match[2].trim();

  // Extract fields
  const titleMatch = frontmatter.match(/title:\s*"([^"]*)"/);
  const dateMatch = frontmatter.match(/date:\s*(.+)/);
  const imageMatch = frontmatter.match(/coverImage:\s*"([^"]*)"/);
  const categoriesMatch = frontmatter.match(/categories:\s*\n\s*-\s*"([^"]*)"/);

  if (!titleMatch) return;

  const title = titleMatch[1];
  const date = dateMatch ? dateMatch[1] : '2023-01-01';
  const image = imageMatch ? imageMatch[1] : '';
  const category = categoriesMatch ? categoriesMatch[1] : 'publikatsii';

  // Create slug from filename
  const slug = file.replace('.md', '');

  // Create excerpt - for posts with minimal content, note that they're external links
  let excerpt = body.substring(0, 150).trim();
  if (!excerpt || excerpt.length < 50) {
    excerpt = `Публикация о ${title.toLowerCase()}. Подробности на внешнем ресурсе.`;
  }

  // Create new frontmatter for Astro
  const newFrontmatter = `---
publishDate: ${date}T00:00:00Z
title: "${title}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
${image ? `image: ~/assets/images/publications/${image}` : ''}
category: ${category === 'publikatsii' ? 'Новости' : category}
tags:
  - спутниковая связь
  - оборудование
author: MW-Lab Team
metadata:
  title: "${title} | MW-Lab"
  description: "${excerpt.replace(/"/g, '\\"')}"
---

${body || `# ${title}\n\nПодробная информация доступна на внешнем ресурсе.\n\n[Читать далее →](https://cs.groteck.ru)`}
`;

  // Check if file already exists in src/data/post
  const outputPath = path.join(__dirname, `../src/data/post/${slug}.md`);
  if (fs.existsSync(outputPath)) {
    console.log(`⚠ Skipping (already exists): ${slug}.md`);
    return;
  }

  // Write to src/data/post directory
  fs.writeFileSync(outputPath, newFrontmatter);

  console.log(`✓ Migrated: ${title} -> ${slug}.md`);
});

console.log(`\n=== Migration Complete ===`);
console.log(`${files.length} blog posts migrated to src/data/post/`);
