import { notFound } from "next/navigation";

import {
  loadAllReleases,
  loadReleaseBySlug,
} from "../../../lib/content/load-releases";
import { loadSeriesRegistry } from "../../../lib/content/load-series-registry";
import { loadAllArtists } from "../../../lib/content/load-artists";

type ParamsPromise = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  const releases = loadAllReleases();
  return releases.map((doc) => ({
    slug: doc.meta.slug,
  }));
}

export default async function ReleasePage({ params }: ParamsPromise) {
  const { slug } = await params;

  const releaseDoc = loadReleaseBySlug(slug);

  if (!releaseDoc) {
    notFound();
  }

  const { meta, body } = releaseDoc;

  const seriesRegistry = loadSeriesRegistry();
  const series = seriesRegistry.find((s) => s.id === meta.series_id) ?? null;

  const artists = loadAllArtists().map((a) => a.meta);
  const artistById = Object.fromEntries(artists.map((a) => [a.id, a]));

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "0.25rem",
        }}
      >
        {meta.title}
      </h1>

      <p
        style={{
          fontSize: "0.9rem",
          opacity: 0.8,
          marginBottom: "0.5rem",
        }}
      >
        {meta.catalog_number} · {meta.release_date}
        {series && ` · ${series.name}`}
      </p>

      <p
        style={{
          fontSize: "0.95rem",
          marginBottom: "1rem",
        }}
      >
        {meta.primary_artists
          .map((id) => artistById[id]?.name ?? id)
          .join(", ")}
      </p>

      {meta.label_copy_short && (
        <p
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
          }}
        >
          {meta.label_copy_short}
        </p>
      )}

      {body && (
        <div
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "1.75rem",
          }}
        >
          {body}
        </div>
      )}

      {meta.tracks.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
            }}
          >
            Tracklist
          </h2>
          <ol
            style={{
              paddingLeft: "1.2rem",
              fontSize: "0.95rem",
              lineHeight: 1.5,
            }}
          >
            {meta.tracks
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((t) => (
                <li key={t.id}>
                  {t.title}
                  {t.remix_artists.length > 0 && (
                    <> (Remix: {t.remix_artists.join(", ")})</>
                  )}
                  {t.bpm && <> · {t.bpm} BPM</>}
                  {t.key && <> · {t.key}</>}
                </li>
              ))}
          </ol>
        </section>
      )}
    </div>
  );
}
