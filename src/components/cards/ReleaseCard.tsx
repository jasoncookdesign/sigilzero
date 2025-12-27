"use client";

import { Card } from "../ui/Card";
import type { ReleaseDocument } from "../../lib/content/load-releases";
import type { SeriesRegistryItem } from "../../lib/content/load-series-registry";
import type { Artist } from "../../lib/schemas/artist";
import PlaceholderImage from "../PlaceholderImage";
import { getReleaseStatus } from "../../lib/release-status";

type Props = {
  release: ReleaseDocument["meta"];
  series?: SeriesRegistryItem | null;
  artists?: Artist[];
};

export default function ReleaseCard({ release, series, artists }: Props) {
  const status = getReleaseStatus(release.release_date);

  // Format artist names from IDs
  const getArtistNames = () => {
    if (!artists || artists.length === 0) return null;
    
    const artistMap = Object.fromEntries(artists.map(a => [a.id, a.name]));
    const names = release.primary_artists
      .map(id => artistMap[id])
      .filter(Boolean);
    
    if (names.length === 0) return null;
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
  };

  const artistNames = getArtistNames();

  return (
    <Card href={`/releases/${release.slug}`}>
      <div>
        <div className="relative w-full overflow-hidden bg-gray-900 aspect-square">
          <PlaceholderImage
            src={release.cover_art}
            alt={release.title}
            width={400}
            height={400}
            fill
            placeholderText={release.catalog_number}
            className="object-cover"
          />
          {status.type && (
            <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium border rounded ${
              status.type === "coming-soon"
                ? "border-gray-400 text-gray-300 bg-black/40 backdrop-blur-sm"
                : "border-gray-300 text-white bg-black/40 backdrop-blur-sm"
            }`}>
              {status.label}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-2 text-label">
            {release.catalog_number}
          </div>

          <h3 className="mb-2 h-sm line-clamp-2">
            {release.title}
          </h3>

          {artistNames && (
            <div className="mb-2 text-sm text-gray-300">
              {artistNames}
            </div>
          )}

          <div className="text-sm text-muted">
            {series?.name || release.series_id} • {(release.type?.[0]?.toUpperCase() + release.type?.slice(1))} • {release.release_date}
          </div>
        </div>
      </div>
    </Card>
  );
}
