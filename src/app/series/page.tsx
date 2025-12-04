// src/app/series/page.tsx

import { loadAllSeries } from "../../lib/content/load-series";
import SeriesGrid from "./SeriesGrid";

export default function SeriesPage() {
  const seriesDocs = loadAllSeries();
  const series = seriesDocs.map((doc) => doc.meta);

  return (
    <div>
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Series
      </h2>

      <SeriesGrid series={series} />
    </div>
  );
}
