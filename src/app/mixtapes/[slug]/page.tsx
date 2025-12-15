import { notFound } from "next/navigation";

import {
  loadAllMixtapes,
  loadMixtapeBySlug,
} from "../../../lib/content/load-mixtapes";
import { loadAllArtists } from "../../../lib/content/load-artists";
import MixtapePlayButton from "../../../components/mixtapes/MixtapePlayButton";
import PlaceholderImage from "../../../components/PlaceholderImage";

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
      <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg bg-gray-900">
        <PlaceholderImage
          src={meta.cover_image}
          alt={meta.title}
          width={800}
          height={400}
          fill
          placeholderText={meta.title}
          className="object-cover"
        />
      </div>

      <h1 className="text-4xl mb-2">
        {meta.title}
      </h1>

      <p className="text-sm text-muted mb-2">
        {artist ? artist.name : meta.artist_id}
        {meta.date && ` · ${meta.date}`}
        {meta.location && ` · ${meta.location}`}
      </p>

      {meta.event_name && (
        <p className="text-sm opacity-85 mb-3">
          {meta.event_name}
          {meta.event_series && ` · ${meta.event_series}`}
        </p>
      )}

      {body && (
        <div className="text-sm leading-relaxed mb-6">
          {body}
        </div>
      )}

      {meta.embed_url && (
        <div className="my-4 mb-6">
          <MixtapePlayButton embedUrl={meta.embed_url} title={meta.title} id={meta.id} artist={artist?.name ?? meta.artist_id} />
          <div className="mt-3">
            <iframe
              src={meta.embed_url}
              title={`${meta.title} player`}
              className="w-full h-42 border-0"
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}
