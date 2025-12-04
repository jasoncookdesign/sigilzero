// src/lib/filters/mixtapes.ts
import type { MixtapeDocument } from "../content/load-mixtapes";

export type MixtapeFilterCriteria = {
  query?: string | undefined;        // text search
  artistIds?: string[] | undefined;  // ["dyson-hope", "nototo", "b-squared", ...]
  platforms?: string[] | undefined;  // ["soundcloud", "mixcloud", "youtube", "other"]
  year?: number | undefined;         // 2024, 2025, etc.
};

export function filterMixtapes(
  mixtapes: MixtapeDocument[],
  criteria: MixtapeFilterCriteria
): MixtapeDocument[] {
  const q = criteria.query?.trim().toLowerCase() ?? "";

  return mixtapes.filter(({ meta }) => {
    // Text search: title + event + location
    if (q) {
      const haystack = `${meta.title} ${meta.event_name ?? ""} ${
        meta.location ?? ""
      }`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // Artist filter
    if (criteria.artistIds && criteria.artistIds.length > 0) {
      if (!criteria.artistIds.includes(meta.artist_id)) return false;
    }

    // Platform filter
    if (criteria.platforms && criteria.platforms.length > 0) {
      if (!criteria.platforms.includes(meta.platform)) return false;
    }

    // Year filter (from date string)
    if (criteria.year) {
      const year = new Date(meta.date).getFullYear();
      if (year !== criteria.year) return false;
    }

    return true;
  });
}
