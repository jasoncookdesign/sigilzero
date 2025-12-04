"use client";

import type { Series } from "../../lib/schemas/series";
import SeriesCard from "../../components/cards/SeriesCard";

type Props = {
  series: Series[];
};

export default function SeriesGrid({ series }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
  );
}
