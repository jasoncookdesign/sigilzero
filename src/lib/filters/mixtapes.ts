// src/lib/filters/mixtapes.ts
import type { MixtapeDocument } from "../content/load-mixtapes";

export type MixtapeFilterCriteria = {
  query?: string | undefined;        // text search
  artistIds?: string[] | undefined;  // ["dyson-hope", "nototo", "b-squared", ...]
  platforms?: string[] | undefined;  // ["soundcloud", "mixcloud", "youtube", "other"]
  genres?: string[] | undefined;     // ["techno", "house", ...]
  moods?: string[] | undefined;      // ["dark", "hypnotic", ...]
  tags?: string[] | undefined;       // custom tags
  year?: number | undefined;         // 2024, 2025, etc.
};

// Fuzzy search: checks if query matches in text
function fuzzyMatch(haystack: string, query: string): boolean {
  const h = haystack.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;

  // Exact substring match (case-insensitive)
  if (h.includes(q)) return true;

  // Fuzzy: all characters of query appear in haystack in order
  let hIdx = 0;
  for (let qIdx = 0; qIdx < q.length; qIdx++) {
    const char = q.charAt(qIdx);
    const charIdx = h.indexOf(char, hIdx);
    if (charIdx === -1) return false;
    hIdx = charIdx + 1;
  }
  return true;
}

export function filterMixtapes(
  mixtapes: MixtapeDocument[],
  criteria: MixtapeFilterCriteria
): MixtapeDocument[] {
  const q = criteria.query?.trim() ?? "";

  return mixtapes.filter(({ meta }) => {
    // Fuzzy text search: title + event + location + artist_id
    if (q) {
      const searchText = [
        meta.title,
        meta.event_name ?? "",
        meta.location ?? "",
        meta.artist_id,
      ].join(" ");

      if (!fuzzyMatch(searchText, q)) return false;
    }

    // Artist filter
    if (criteria.artistIds && criteria.artistIds.length > 0) {
      if (!criteria.artistIds.includes(meta.artist_id)) return false;
    }

    // Platform filter
    if (criteria.platforms && criteria.platforms.length > 0) {
      if (!criteria.platforms.includes(meta.platform)) return false;
    }

    // Genre filter
    if (criteria.genres && criteria.genres.length > 0) {
      const matchesGenre = meta.genres.some((g) =>
        criteria.genres!.includes(g)
      );
      if (!matchesGenre) return false;
    }

    // Mood filter
    if (criteria.moods && criteria.moods.length > 0) {
      const matchesMood = meta.moods.some((m) =>
        criteria.moods!.includes(m)
      );
      if (!matchesMood) return false;
    }

    // Tag filter
    if (criteria.tags && criteria.tags.length > 0) {
      const matchesTag = meta.tags.some((t) =>
        criteria.tags!.includes(t)
      );
      if (!matchesTag) return false;
    }

    // Year filter (from date string)
    if (criteria.year) {
      const year = new Date(meta.date).getFullYear();
      if (year !== criteria.year) return false;
    }

    return true;
  });
}
