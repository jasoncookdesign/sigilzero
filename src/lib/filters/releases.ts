// src/lib/filters/releases.ts
import type { ReleaseDocument } from "../content/load-releases";

export type ReleaseFilterCriteria = {
  query?: string | undefined;             // text search
  seriesIds?: string[] | undefined;       // ["core", "black", ...]
  types?: string[] | undefined;           // ["single", "maxi-single", "ep", "album"]
  artistIds?: string[] | undefined;       // ["dyson-hope", "nototo", ...]
  genres?: string[] | undefined;          // ["techno", "house", ...]
  moods?: string[] | undefined;           // ["dark", "peak-time", ...]
  year?: number | undefined;              // 2024, 2025, etc.
  bpmMin?: number | undefined;            // minimum BPM
  bpmMax?: number | undefined;            // maximum BPM
};

// Extract min/max BPM from "130-140" string format
function parseBpmRange(bpmRangeStr: string | undefined): { min: number; max: number } | null {
  if (!bpmRangeStr) return null;
  const match = bpmRangeStr.match(/(\d+)\s*-\s*(\d+)/);
  if (!match || !match[1] || !match[2]) return null;
  return {
    min: parseInt(match[1], 10),
    max: parseInt(match[2], 10),
  };
}

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

export function filterReleases(
  releases: ReleaseDocument[],
  criteria: ReleaseFilterCriteria
): ReleaseDocument[] {
  const q = criteria.query?.trim() ?? "";

  return releases.filter(({ meta, body }) => {
    // Fuzzy text search: title + catalog_number + track names + artist names
    if (q) {
      const trackArtists = meta.tracks.flatMap((t) => [
        ...t.primary_artists,
        ...(t.remix_artists ?? []),
        ...(t.featured_artists ?? []),
      ]);
      const searchText = [
        meta.title,
        meta.catalog_number,
        ...meta.tracks.map((t) => t.title),
        ...meta.primary_artists,
        ...meta.remix_artists,
        ...trackArtists,
      ].join(" ");

      if (!fuzzyMatch(searchText, q)) return false;
    }

    // Series filter
    if (criteria.seriesIds && criteria.seriesIds.length > 0) {
      if (!criteria.seriesIds.includes(meta.series_id)) return false;
    }

    // Type filter
    if (criteria.types && criteria.types.length > 0) {
      if (!criteria.types.includes(meta.type)) return false;
    }

    // Artist filter (primary or remix)
    if (criteria.artistIds && criteria.artistIds.length > 0) {
      const allArtistIds = [
        ...meta.primary_artists,
        ...meta.remix_artists,
        ...meta.tracks.flatMap((t) => [
          ...t.primary_artists,
          ...(t.remix_artists ?? []),
          ...(t.featured_artists ?? []),
        ]),
      ];
      const intersects = allArtistIds.some((id) =>
        criteria.artistIds!.includes(id)
      );
      if (!intersects) return false;
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

    // Year filter
    if (criteria.year) {
      const year = new Date(meta.release_date).getFullYear();
      if (year !== criteria.year) return false;
    }

    // BPM range filter
    if (criteria.bpmMin !== undefined || criteria.bpmMax !== undefined) {
      const range = parseBpmRange(meta.bpm_range);
      if (!range) return false; // No BPM data, exclude

      const releaseBpmMin = range.min;
      const releaseBpmMax = range.max;

      // Check if release's BPM range overlaps with filter range
      const filterMin = criteria.bpmMin ?? 0;
      const filterMax = criteria.bpmMax ?? 300;

      if (releaseBpmMax < filterMin || releaseBpmMin > filterMax) {
        return false;
      }
    }

    return true;
  });
}
