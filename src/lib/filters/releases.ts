// src/lib/filters/releases.ts
import type { ReleaseDocument } from "../content/load-releases";

export type ReleaseFilterCriteria = {
  query?: string | undefined;             // text search
  seriesIds?: string[] | undefined;       // ["core", "black", ...]
  types?: string[] | undefined;           // ["single", "maxi-single", "ep", "album"]
  artistIds?: string[] | undefined;       // ["dyson-hope", "nototo", ...]
  year?: number | undefined;              // 2024, 2025, etc.
};

export function filterReleases(
  releases: ReleaseDocument[],
  criteria: ReleaseFilterCriteria
): ReleaseDocument[] {
  const q = criteria.query?.trim().toLowerCase() ?? "";

  return releases.filter(({ meta }) => {
    // Text search: title + catalog_number
    if (q) {
      const haystack = `${meta.title} ${meta.catalog_number}`.toLowerCase();
      if (!haystack.includes(q)) return false;
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
      ];
      const intersects = allArtistIds.some((id) =>
        criteria.artistIds!.includes(id)
      );
      if (!intersects) return false;
    }

    // Year filter
    if (criteria.year) {
      const year = new Date(meta.release_date).getFullYear();
      if (year !== criteria.year) return false;
    }

    return true;
  });
}
