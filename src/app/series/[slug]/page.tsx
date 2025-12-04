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
      <h1 className="text-4xl mb-2">
        {meta.name}
      </h1>

      {meta.tagline && (
        <p className="text-sm text-muted mb-3">
          {meta.tagline}
        </p>
      )}

      {body && (
        <div className="text-sm leading-relaxed mb-6">
          {body}
        </div>
      )}

      {releases.length > 0 && (
        <section>
          <h2 className="h-md mb-3">
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
