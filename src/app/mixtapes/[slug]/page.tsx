import { notFound } from "next/navigation";

import {
  loadAllMixtapes,
  loadMixtapeBySlug,
} from "../../../lib/content/load-mixtapes";
import { loadAllArtists } from "../../../lib/content/load-artists";

type ParamsPromise = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  const mixtapes = loadAllMixtapes();
  return mixtapes.map((doc) => ({
    slug: doc.meta.slug,
  }));
}

export default async function MixtapePage({ params }: ParamsPromise) {
  const { slug } = await params;

  const mixtapeDoc = loadMixtapeBySlug(slug);

  if (!mixtapeDoc) {
    notFound();
  }

  const { meta, body } = mixtapeDoc;

  const artist = loadAllArtists()
    .map((a) => a.meta)
    .find((a) => a.id === meta.artist_id);

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "0.5rem",
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
        {artist ? artist.name : meta.artist_id}
        {meta.date && ` · ${meta.date}`}
        {meta.location && ` · ${meta.location}`}
      </p>

      {meta.event_name && (
        <p
          style={{
            fontSize: "0.9rem",
            opacity: 0.85,
            marginBottom: "0.75rem",
          }}
        >
          {meta.event_name}
          {meta.event_series && ` · ${meta.event_series}`}
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

      {meta.embed_url && (
        <div
          style={{
            marginTop: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <iframe
            src={meta.embed_url}
            style={{
              width: "100%",
              height: "166px",
              border: "none",
            }}
            allow="autoplay"
          />
        </div>
      )}
    </div>
  );
}
