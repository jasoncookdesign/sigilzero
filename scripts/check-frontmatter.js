#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

const contentDir = path.join(process.cwd(), 'content');
if (!fs.existsSync(contentDir)) {
  console.log('No content directory found, skipping frontmatter check.');
  process.exit(0);
}

const files = walkDir(contentDir).filter((f) => {
  const base = path.basename(f);
  // only check markdown-like files (md/mdx) or files that start with --- frontmatter
  if (base.endsWith('.md') || base.endsWith('.mdx')) return true;
  const first = fs.readFileSync(f, 'utf8').slice(0, 4);
  return first === '---\n' || first === '---\r';
});

const errors = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  let data = {};
  try {
    data = matter(raw).data || {};
  } catch (e) {
    errors.push({ file, msg: 'Failed to parse frontmatter' });
    continue;
  }

  for (const [key, val] of Object.entries(data)) {
    if (val === null) {
      errors.push({ file, key });
    }
  }
}

if (errors.length > 0) {
  console.error('ERROR: Found null frontmatter values (these parse as null in YAML).');
  console.error('Please replace with explicit empty arrays or values.');
  console.error('');
  for (const e of errors) {
    if (e.msg) console.error(`${e.file}: ${e.msg}`)
    else console.error(`${e.file}: ${e.key}`);
  }
  process.exit(2);
}

console.log('No null frontmatter values found.');
