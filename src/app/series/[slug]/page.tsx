import { notFound } from "next/navigation";

import {
  loadAllSeries,
  loadSeriesBySlug,
} from "../../../lib/content/load-series";
import { loadAllReleases } from "../../../lib/content/load-releases";
import PlaceholderImage from "../../../components/PlaceholderImage";

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
      {meta.glyph ? (
        <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg bg-gray-900">
          <PlaceholderImage
            src={meta.glyph}
            alt={meta.name}
            width={800}
            height={400}
            fill
            placeholderText={meta.short_label}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-64 mb-6 rounded-lg bg-gradient-to-br flex items-center justify-center" style={{ backgroundImage: `linear-gradient(135deg, ${meta.color_hex || '#666'} 0%, ${meta.accent_hex || '#333'} 100%)` }}>
          <span className="text-5xl font-bold text-white opacity-60">{meta.short_label}</span>
        </div>
      )}

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
