import { notFound } from "next/navigation";

import {
  loadAllMixtapes,
  loadMixtapeBySlug,
} from "../../../lib/content/load-mixtapes";
import { loadAllArtists } from "../../../lib/content/load-artists";
import PlaceholderImage from "../../../components/PlaceholderImage";
import Section from "../../../components/Section";
import SoundCloudEmbed from "../../../components/audio/SoundCloudEmbed";

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
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <PlaceholderImage
            src={meta.cover_image}
            alt=""
            width={1600}
            height={1600}
            fill
            placeholderText={meta.title}
            className="object-cover"
          />
          {/* Dark overlay for dimming */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content Container */}
        <div className="container-sigil px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto py-16 sm:py-24">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 sm:p-8">
              <h1 className="text-4xl sm:text-5xl mb-3 text-white">
                {artist ? artist.name : meta.artist_id} - {meta.title}
              </h1>

              <p className="text-sm text-gray-300 mb-2">
                {meta.date && `${meta.date}`}
                {meta.date && meta.location && ` · `}
                {meta.location && `${meta.location}`}
              </p>

              {meta.event_name && (
                <p className="text-sm text-gray-300 mb-4">
                  {meta.event_name}
                  {meta.event_series && ` · ${meta.event_series}`}
                </p>
              )}

              {body && (
                <div className="text-sm leading-relaxed text-gray-200">
                  {body}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {meta.embed_url && meta.platform === "soundcloud" && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <SoundCloudEmbed
              url={meta.embed_url}
              title={`${meta.title} by ${artist?.name ?? meta.artist_id}`}
              visual={true}
            />
          </div>
        </Section>
      )}
    </div>
  );
}
