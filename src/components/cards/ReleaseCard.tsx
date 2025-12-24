"use client";

import { Card } from "../ui/Card";
import type { ReleaseDocument } from "../../lib/content/load-releases";
import type { SeriesRegistryItem } from "../../lib/content/load-series-registry";
import PlaceholderImage from "../PlaceholderImage";
import { getReleaseStatus } from "../../lib/release-status";

type Props = {
  release: ReleaseDocument["meta"];
  series?: SeriesRegistryItem | null;
};

export default function ReleaseCard({ release, series }: Props) {
  const status = getReleaseStatus(release.release_date);

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

          <div className="text-sm text-muted">
            {series?.name || release.series_id} • {release.release_date}
          </div>
        </div>
      </div>
    </Card>
  );
}
