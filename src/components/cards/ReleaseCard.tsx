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
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "100%",
            overflow: "hidden",
          }}
        >
          <Image
            src={release.cover_art}
            alt={release.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div style={{ padding: "0.75rem 0.9rem 1rem" }}>
          <div
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
              marginBottom: "0.25rem",
            }}
          >
            {release.catalog_number}
          </div>

          <h3
            style={{
              fontSize: "1rem",
              margin: 0,
              marginBottom: "0.4rem",
            }}
          >
            {release.title}
          </h3>

          <div
            style={{
              fontSize: "0.8rem",
              opacity: 0.75,
            }}
          >
            {series ? series.name : release.series_id} • {release.release_date}
          </div>
        </div>
      </div>
    </Card>
  );
}
