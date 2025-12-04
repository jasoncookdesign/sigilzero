import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { getContentDir, getMarkdownFilesInDir, readMarkdownFile } from "./fs-helpers";
import { ReleaseSchema, type Release } from "../schemas/release";

export type ReleaseDocument = {
  meta: Release;
  body: string;
};

function parseReleaseFile(filePath: string): ReleaseDocument {
  const raw = readMarkdownFile(filePath);
  const { data, content } = matter(raw);

  const meta = ReleaseSchema.parse(data); // Zod validation

  return {
    meta,
    body: content,
  };
}

/**
 * Load a single release by slug (e.g. "need-more-drugs")
 */
export function loadReleaseBySlug(slug: string): ReleaseDocument | null {
  const releasesDir = getContentDir("releases");
  const files = getMarkdownFilesInDir(releasesDir);

  const file = files.find((f) => f.includes(slug));
  if (!file) return null;

  const fullPath = path.join(releasesDir, file);
  return parseReleaseFile(fullPath);
}

/**
 * Load all releases, sorted by release_date desc
 */
export function loadAllReleases(): ReleaseDocument[] {
  const releasesDir = getContentDir("releases");
  const files = getMarkdownFilesInDir(releasesDir);

  const docs = files.map((file) => {
    const fullPath = path.join(releasesDir, file);
    return parseReleaseFile(fullPath);
  });

  return docs.sort((a, b) => {
    const da = new Date(a.meta.release_date).getTime();
    const db = new Date(b.meta.release_date).getTime();
    return db - da;
  });
}
