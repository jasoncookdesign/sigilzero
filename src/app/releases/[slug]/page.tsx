import { notFound } from "next/navigation";

import {
  loadAllReleases,
  loadReleaseBySlug,
} from "../../../lib/content/load-releases";
import { loadSeriesRegistry } from "../../../lib/content/load-series-registry";
import { loadAllArtists } from "../../../lib/content/load-artists";
import ReleaseTrackList from "../../../components/releases/ReleaseTrackList";
import PlaceholderImage from "../../../components/PlaceholderImage";
import Section from "../../../components/Section";

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
      <Section>
        <div className="container-sigil px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-80 mb-6 overflow-hidden rounded-lg bg-gray-900">
            <PlaceholderImage
              src={meta.cover_art}
              alt={meta.title}
              width={800}
              height={600}
              fill
              placeholderText={meta.catalog_number}
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl mb-1">
            {meta.title}
          </h1>

          <p className="text-sm text-muted mb-2">
            {meta.catalog_number} · {meta.release_date}
            {series && ` · ${series.name}`}
          </p>

          <p className="text-sm mb-4">
            {meta.primary_artists
              .map((id) => artistById[id]?.name ?? id)
              .join(", ")}
          </p>

          {meta.label_copy_short && (
            <p className="text-sm leading-relaxed mb-5">
              {meta.label_copy_short}
            </p>
          )}

          {body && (
            <div className="text-sm leading-relaxed mb-7">
              {body}
            </div>
          )}
        </div>
      </Section>

      {meta.tracks.length > 0 && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <ReleaseTrackList
              releaseTitle={meta.title}
              tracks={meta.tracks.map((t) => ({
                id: t.id,
                title: t.title,
                preview_url: t.preview_url || null,
                duration_seconds: t.duration_seconds || null,
                artists: t.primary_artists,
                position: t.position,
                remix_artists: t.remix_artists || [],
                bpm: t.bpm || null,
                key: t.key || null,
              }))}
            />
          </div>
        </Section>
      )}
    </div>
  );
}
