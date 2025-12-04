"use client";

import { Card } from "../ui/Card";

import type { Series } from "../../lib/schemas/series";

type Props = {
  series: Series;
};

export default function SeriesCard({ series }: Props) {
  return (
    <Card href={`/series/${series.slug}`}>
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            fontSize: "0.85rem",
            opacity: 0.75,
            marginBottom: "0.25rem",
          }}
        >
          {series.short_label ?? series.name}
        </div>
        <h3
          style={{
            fontSize: "1.1rem",
            margin: "0 0 0.4rem 0",
          }}
        >
          {series.name}
        </h3>
        {series.tagline && (
          <div
            style={{
              fontSize: "0.9rem",
              opacity: 0.8,
            }}
          >
            {series.tagline}
          </div>
        )}
      </div>
    </Card>
  );
}
