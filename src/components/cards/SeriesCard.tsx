"use client";

import { Card } from "../ui/Card";
import type { Series } from "../../lib/schemas/series";
import PlaceholderImage from "../PlaceholderImage";

type Props = {
  series: Series;
};

export default function SeriesCard({ series }: Props) {
  return (
    <Card href={`/series/${series.slug}`}>
      <div>
        <div className="relative w-full h-48 overflow-hidden bg-gray-900">
          {series.glyph ? (
            <PlaceholderImage
              src={series.glyph}
              alt={series.name}
              width={400}
              height={300}
              fill
              placeholderText={series.short_label}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${series.color_hex || '#666'} 0%, ${series.accent_hex || '#333'} 100%)` }}>
              <span className="text-3xl font-bold text-white opacity-60">{series.short_label}</span>
            </div>
          )}
        </div>

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
      </div>
    </Card>
  );
}
