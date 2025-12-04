// src/app/series/page.tsx

import { loadAllSeries } from "../../lib/content/load-series";
import SeriesGrid from "./SeriesGrid";

export default function SeriesPage() {
  const seriesDocs = loadAllSeries();
  const series = seriesDocs.map((doc) => doc.meta);

  return (
    <div>
      <h2 className="text-4xl mb-6 text-center">
        Series
      </h2>

      <SeriesGrid series={series} />
    </div>
  );
}
