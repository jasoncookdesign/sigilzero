"use client";

import type { Series } from "../../lib/schemas/series";
import SeriesCard from "../../components/cards/SeriesCard";

type Props = {
  series: Series[];
};

export default function SeriesGrid({ series }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {series.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
  );
}
