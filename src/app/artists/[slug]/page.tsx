import { notFound } from "next/navigation";

import {
  loadAllArtists,
  loadArtistBySlug,
} from "../../../lib/content/load-artists";
import { loadAllReleases } from "../../../lib/content/load-releases";
import { loadAllMixtapes } from "../../../lib/content/load-mixtapes";
import PlaceholderImage from "../../../components/PlaceholderImage";
import Section from "../../../components/Section";
import ReleaseCard from "../../../components/cards/ReleaseCard";
import MixtapeCard from "../../../components/cards/MixtapeCard";

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

  const releases = loadAllReleases().filter((r) => {
    // Check release-level primary/remix artists
    if (
      r.meta.primary_artists.includes(meta.id) ||
      r.meta.remix_artists.includes(meta.id)
    ) {
      return true;
    }

    // Check track-level artists (for individual track remixes/features)
    return r.meta.tracks.some(
      (track) =>
        track.primary_artists.includes(meta.id) ||
        track.remix_artists.includes(meta.id) ||
        (track.featured_artists ?? []).includes(meta.id)
    );
  });

  const mixtapes = loadAllMixtapes().filter(
    (m) => m.meta.artist_id === meta.id
  );

  return (
    <div>
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <PlaceholderImage
            src={meta.photo}
            alt=""
            width={1600}
            height={1600}
            fill
            placeholderText={meta.name}
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
                {meta.name}
              </h1>

              {meta.location && (
                <p className="text-sm text-gray-300 mb-4">
                  {meta.location}
                </p>
              )}

              {body && (
                <div className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                  {body}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {releases.length > 0 && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <h2 className="h-md mb-6">
              Releases
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {releases.map((r) => (
                <ReleaseCard key={r.meta.id} release={r.meta} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {mixtapes.length > 0 && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <h2 className="h-md mb-6">
              Mixtapes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mixtapes.map((m) => (
                <MixtapeCard key={m.meta.id} mixtape={m.meta} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
