// Reads committed content so e2e expectations follow the data rather than
// hard-coded counts. Only frontmatter fields are read; no filter logic is
// reimplemented here.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

type Frontmatter = Record<string, any>;

function load(type: string): Frontmatter[] {
  const dir = path.join(process.cwd(), 'content', type);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => matter(fs.readFileSync(path.join(dir, f), 'utf8')).data);
}

const isActive = (d: Frontmatter) => d.active !== false;

export const activeReleases = () => load('releases').filter(isActive);
export const activeMixtapes = () => load('mixtapes').filter(isActive);
export const activeArtists = () => load('artists').filter(isActive);
export const allSeries = () => load('series');
export const hasActiveSeries = () => allSeries().some((s) => s.active === true || s.active === undefined);
