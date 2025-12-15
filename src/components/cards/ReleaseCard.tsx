"use client";

import { Card } from "../ui/Card";
import type { ReleaseDocument } from "../../lib/content/load-releases";
import type { SeriesRegistryItem } from "../../lib/content/load-series-registry";
import PlaceholderImage from "../PlaceholderImage";

type Props = {
  release: ReleaseDocument["meta"];
  series?: SeriesRegistryItem | null;
};

export default function ReleaseCard({ release, series }: Props) {
  return (
    <Card href={`/releases/${release.slug}`}>
      <div>
        <div className="relative w-full h-48 overflow-hidden bg-gray-900">
          <PlaceholderImage
            src={release.cover_art}
            alt={release.title}
            width={400}
            height={300}
            fill
            placeholderText={release.catalog_number}
            className="object-cover"
          />
        </div>

        <div className="p-3 sm:p-4">
          <div className="text-label mb-2">
            {release.catalog_number}
          </div>

          <h3 className="h-sm mb-2 line-clamp-2">
            {release.title}
          </h3>

          <div className="text-sm text-muted">
            {series ? series.name : release.series_id} • {release.release_date}
          </div>
        </div>
      </div>
    </Card>
  );
}
