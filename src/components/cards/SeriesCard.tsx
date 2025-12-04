"use client";

import { Card } from "../ui/Card";

import type { Series } from "../../lib/schemas/series";

type Props = {
  series: Series;
};

export default function SeriesCard({ series }: Props) {
  return (
    <Card href={`/series/${series.slug}`}>
      <div className="p-3 sm:p-4">
        <div className="text-label mb-2">
          {series.short_label ?? series.name}
        </div>
        <h3 className="h-sm mb-2">
          {series.name}
        </h3>
        {series.tagline && (
          <div className="text-sm text-muted">
            {series.tagline}
          </div>
        )}
      </div>
    </Card>
  );
}
