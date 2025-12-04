import path from "path";
import matter from "gray-matter";
import { getContentDir, getMarkdownFilesInDir, readMarkdownFile } from "./fs-helpers";
import { ArtistSchema, type Artist } from "../schemas/artist";

export type ArtistDocument = {
  meta: Artist;
  body: string;
};

function parseArtistFile(filePath: string): ArtistDocument {
  const raw = readMarkdownFile(filePath);
  const { data, content } = matter(raw);

  const meta = ArtistSchema.parse(data);

  return {
    meta,
    body: content,
  };
}

/**
 * Load a single artist by slug (e.g. "dyson-hope")
 */
export function loadArtistBySlug(slug: string): ArtistDocument | null {
  const artistsDir = getContentDir("artists");
  const files = getMarkdownFilesInDir(artistsDir);

  const file = files.find((f) => f.includes(slug));
  if (!file) return null;

  const fullPath = path.join(artistsDir, file);
  return parseArtistFile(fullPath);
}

/**
 * Load all artists, sorted by name
 */
export function loadAllArtists(): ArtistDocument[] {
  const artistsDir = getContentDir("artists");
  const files = getMarkdownFilesInDir(artistsDir);

  const docs = files.map((file) => {
    const fullPath = path.join(artistsDir, file);
    return parseArtistFile(fullPath);
  });

  return docs.sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}
