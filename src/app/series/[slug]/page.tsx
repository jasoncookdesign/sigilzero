import { notFound } from "next/navigation";

import {
  loadAllSeries,
  loadSeriesBySlug,
} from "../../../lib/content/load-series";
import { loadAllReleases } from "../../../lib/content/load-releases";

type ParamsPromise = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  const seriesDocs = loadAllSeries();
  return seriesDocs.map((doc) => ({
    slug: doc.meta.slug,
  }));
}

export default async function SeriesPage({ params }: ParamsPromise) {
  const { slug } = await params;

  const seriesDoc = loadSeriesBySlug(slug);

  if (!seriesDoc) {
    notFound();
  }

  const { meta, body } = seriesDoc;

  const releases = loadAllReleases().filter(
    (r) => r.meta.series_id === meta.id
  );

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "0.5rem",
        }}
      >
        {meta.name}
      </h1>

      {meta.tagline && (
        <p
          style={{
            fontSize: "0.95rem",
            opacity: 0.85,
            marginBottom: "0.75rem",
          }}
        >
          {meta.tagline}
        </p>
      )}

      {body && (
        <div
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          {body}
        </div>
      )}

      {releases.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "1.3rem",
              marginBottom: "0.75rem",
            }}
          >
            Releases in this series
          </h2>
          <ul>
            {releases.map((r) => (
              <li key={r.meta.id}>
                <a href={`/releases/${r.meta.slug}`}>{r.meta.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
