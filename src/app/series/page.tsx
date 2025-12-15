// src/app/series/page.tsx

import { loadAllSeries } from "../../lib/content/load-series";
import SeriesGrid from "./SeriesGrid";
import Section from "../../components/Section";

export default function SeriesPage() {
  const seriesDocs = loadAllSeries();
  const series = seriesDocs.map((doc) => doc.meta);

  return (
    <Section>
      <div className="container-sigil px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl mb-6 text-center">
          Series
        </h2>

        <SeriesGrid series={series} />
      </div>
    </Section>
  );
}
