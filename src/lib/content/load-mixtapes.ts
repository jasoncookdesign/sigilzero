import path from "path";
import matter from "gray-matter";
import { getContentDir, getMarkdownFilesInDir, readMarkdownFile } from "./fs-helpers";
import { MixtapeSchema, type Mixtape } from "../schemas/mixtape";

export type MixtapeDocument = {
  meta: Mixtape;
  body: string;
};

function parseMixtapeFile(filePath: string): MixtapeDocument {
  const raw = readMarkdownFile(filePath);
  const { data, content } = matter(raw);

  const meta = MixtapeSchema.parse(data);

  return {
    meta,
    body: content,
  };
}

/**
 * Load a single mixtape by slug (e.g. "dyson-hope-mixtape-2025")
 */
export function loadMixtapeBySlug(slug: string): MixtapeDocument | null {
  const mixtapesDir = getContentDir("mixtapes");
  const files = getMarkdownFilesInDir(mixtapesDir);

  const file = files.find((f) => f.includes(slug));
  if (!file) return null;

  const fullPath = path.join(mixtapesDir, file);
  return parseMixtapeFile(fullPath);
}

/**
 * Load all mixtapes, sorted by date desc
 */
export function loadAllMixtapes(): MixtapeDocument[] {
  const mixtapesDir = getContentDir("mixtapes");
  const files = getMarkdownFilesInDir(mixtapesDir);

  const docs = files.map((file) => {
    const fullPath = path.join(mixtapesDir, file);
    return parseMixtapeFile(fullPath);
  });

  return docs.sort((a, b) => {
    const da = new Date(a.meta.date).getTime();
    const db = new Date(b.meta.date).getTime();
    return db - da;
  });
}
