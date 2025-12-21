#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dir = path.join(process.cwd(), 'content', 'mixtapes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

console.log('Normalizing mixtape field ordering...\n');

let updated = 0;

// Define standard field order with all possible fields
const fieldOrder = [
  'id', 'slug', 'artist_id', 'title', 'event_name', 'event_series',
  'date', 'location', 'platform', 'embed_url', 'external_url',
  'duration_minutes', 'cover_image', 'thumbnail_image', 'genres',
  'moods', 'tags', 'featured', 'active', 'related_releases'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  // Check if field order matches standard
  const currentKeys = Object.keys(data);
  const needsReorder = JSON.stringify(currentKeys) !== JSON.stringify(fieldOrder.filter(k => k in data));
  
  if (needsReorder) {
    // Rebuild in correct order, only including fields that exist
    const ordered = {};
    for (const key of fieldOrder) {
      if (key in data) {
        ordered[key] = data[key];
      }
    }
    
    // Reconstruct the file with proper formatting
    const lines = ['---'];
    for (const [key, value] of Object.entries(ordered)) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          lines.push(`${key}: []`);
        } else {
          lines.push(`${key}:`);
          value.forEach(v => lines.push(`  - "${v}"`));
        }
      } else if (typeof value === 'string') {
        lines.push(`${key}: "${value}"`);
      } else if (typeof value === 'number') {
        lines.push(`${key}: ${value}`);
      } else if (typeof value === 'boolean') {
        lines.push(`${key}: ${value}`);
      }
    }
    lines.push('---');
    
    const newContent = lines.join('\n') + '\n' + content;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Reordered: ${file}`);
    updated++;
  }
}

console.log(`\n✨ Updated ${updated} mixtape file(s)\n`);
