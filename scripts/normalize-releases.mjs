#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dir = path.join(process.cwd(), 'content', 'releases');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

console.log('Normalizing release field ordering...\n');

let updated = 0;

// Define standard field order with all possible fields
const fieldOrder = [
  'catalog_number', 'id', 'slug', 'title', 'type', 'series_id',
  'primary_artists', 'remix_artists', 'release_date', 'preorder_date',
  'status', 'genres', 'moods', 'bpm_range', 'key_center',
  'cover_art', 'background_art', 'label_copy_short', 'flagship',
  'active', 'link_groups', 'tracks', 'dj_use_cases', 'playlists_featured_on'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  // Check if field order matches standard
  const currentKeys = Object.keys(data);
  const expectedKeys = fieldOrder.filter(k => k in data);
  const needsReorder = JSON.stringify(currentKeys) !== JSON.stringify(expectedKeys);
  
  if (needsReorder) {
    // Rebuild in correct order
    const ordered = {};
    for (const key of fieldOrder) {
      if (key in data) {
        ordered[key] = data[key];
      }
    }
    
    // Reconstruct the file with proper formatting
    const lines = ['---'];
    for (const [key, value] of Object.entries(ordered)) {
      if (key === 'tracks') {
        // Special handling for tracks array
        lines.push(`${key}:`);
        if (Array.isArray(value)) {
          value.forEach(track => {
            lines.push(`  - id: "${track.id}"`);
            lines.push(`    title: "${track.title}"`);
            lines.push(`    position: ${track.position}`);
            lines.push(`    primary_artists:`);
            track.primary_artists.forEach(a => lines.push(`      - "${a}"`));
            lines.push(`    remix_artists: ${JSON.stringify(track.remix_artists || [])}`);
            if (track.preview_url !== undefined) {
              lines.push(`    preview_url: "${track.preview_url}"`);
            }
          });
        }
      } else if (Array.isArray(value)) {
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
      } else if (value === null || value === undefined) {
        // Skip null/undefined
      } else if (typeof value === 'object') {
        // Handle objects like link_groups
        lines.push(`${key}:`);
        for (const [k, v] of Object.entries(value)) {
          lines.push(`  ${k}: "${v}"`);
        }
      }
    }
    lines.push('---');
    
    const newContent = lines.join('\n') + '\n' + content;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Reordered: ${file}`);
    updated++;
  }
}

console.log(`\n✨ Updated ${updated} release file(s)\n`);
