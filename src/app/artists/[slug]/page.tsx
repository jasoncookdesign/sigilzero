import { notFound } from "next/navigation";

import {
  loadAllArtists,
  loadArtistBySlug,
} from "../../../lib/content/load-artists";
import { loadAllReleases } from "../../../lib/content/load-releases";
import { loadAllMixtapes } from "../../../lib/content/load-mixtapes";

type ParamsPromise = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  const artists = loadAllArtists();
  return artists.map((doc) => ({
    slug: doc.meta.slug,
  }));
}

export default async function ArtistPage({ params }: ParamsPromise) {
  const { slug } = await params;

  const artistDoc = loadArtistBySlug(slug);

  if (!artistDoc) {
    notFound();
  }

  const { meta, body } = artistDoc;

  const releases = loadAllReleases().filter(
    (r) =>
      r.meta.primary_artists.includes(meta.id) ||
      r.meta.remix_artists.includes(meta.id)
  );

  const mixtapes = loadAllMixtapes().filter(
    (m) => m.meta.artist_id === meta.id
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

      {meta.location && (
        <p
          style={{
            fontSize: "0.9rem",
            opacity: 0.8,
            marginBottom: "0.75rem",
          }}
        >
          {meta.location}
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
        <section
          style={{
            marginTop: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              marginBottom: "0.75rem",
            }}
          >
            Releases
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

      {mixtapes.length > 0 && (
        <section
          style={{
            marginTop: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              marginBottom: "0.75rem",
            }}
          >
            Mixtapes
          </h2>
          <ul>
            {mixtapes.map((m) => (
              <li key={m.meta.id}>
                <a href={`/mixtapes/${m.meta.slug}`}>{m.meta.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
