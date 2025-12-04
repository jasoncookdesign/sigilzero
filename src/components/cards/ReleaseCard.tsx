"use client";

import Image from "next/image";
import { Card } from "../ui/Card";
import type { ReleaseDocument } from "../../lib/content/load-releases";
import type { SeriesRegistryItem } from "../../lib/content/load-series-registry";

type Props = {
  release: ReleaseDocument["meta"];
  series?: SeriesRegistryItem | null;
};

export default function ReleaseCard({ release, series }: Props) {
  return (
    <Card href={`/releases/${release.slug}`}>
      <div>
        <div className="relative w-full overflow-hidden bg-gray-900 pb-full">
          <Image
            src={release.cover_art}
            alt={release.title}
            fill
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
