import path from "path";
import matter from "gray-matter";
import { getContentDir, getMarkdownFilesInDir, readMarkdownFile } from "./fs-helpers";
import { SeriesSchema, type Series } from "../schemas/series";

export type SeriesDocument = {
  meta: Series;
  body: string;
};

function parseSeriesFile(filePath: string): SeriesDocument {
  const raw = readMarkdownFile(filePath);
  const { data, content } = matter(raw);

  const meta = SeriesSchema.parse(data);

  return {
    meta,
    body: content,
  };
}

/**
 * Load a single series by slug (e.g. "black", "red", "void", "core")
 */
export function loadSeriesBySlug(slug: string): SeriesDocument | null {
  const seriesDir = getContentDir("series");
  const files = getMarkdownFilesInDir(seriesDir);

  const file = files.find((f) => f.includes(slug));
  if (!file) return null;

  const fullPath = path.join(seriesDir, file);
  return parseSeriesFile(fullPath);
}

/**
 * Load all series documents, sorted by order (then name)
 */
export function loadAllSeries(): SeriesDocument[] {
  const seriesDir = getContentDir("series");
  const files = getMarkdownFilesInDir(seriesDir);

  const docs = files.map((file) => {
    const fullPath = path.join(seriesDir, file);
    return parseSeriesFile(fullPath);
  });

  return docs.sort((a, b) => {
    const ao = a.meta.order ?? 999;
    const bo = b.meta.order ?? 999;

    if (ao !== bo) return ao - bo;
    return a.meta.name.localeCompare(b.meta.name);
  });
}
