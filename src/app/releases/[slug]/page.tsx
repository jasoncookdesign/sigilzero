import { notFound } from "next/navigation";

import {
  loadAllReleases,
  loadReleaseBySlug,
} from "../../../lib/content/load-releases";
import { loadSeriesRegistry } from "../../../lib/content/load-series-registry";
import { loadAllArtists } from "../../../lib/content/load-artists";
import { loadLinkGroupById } from "../../../lib/content/load-links";
import { getReleaseStatus } from "../../../lib/release-status";
import ReleaseTrackList from "../../../components/releases/ReleaseTrackList";
import StreamingLinks from "../../../components/releases/StreamingLinks";
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

  // Load link groups if they exist
  const streamingGroup = meta.link_groups?.streaming
    ? loadLinkGroupById(meta.link_groups.streaming)
    : null;
  const purchaseGroup = meta.link_groups?.purchase
    ? loadLinkGroupById(meta.link_groups.purchase)
    : null;

  // Get release status
  const status = getReleaseStatus(meta.release_date);

  return (
    <div>
      <Section>
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Left column: Image */}
            <div className="flex items-center">
              <div className="relative w-full overflow-hidden bg-gray-900 rounded-lg aspect-square">
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
            </div>

            {/* Right column: Text content */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-3 text-4xl">
                {meta.primary_artists
                  .map((id) => artistById[id]?.name ?? id)
                  .join(", ")} - {meta.title}
              </h1>

              <p className="mb-6 text-sm text-muted">
                {meta.catalog_number} · {meta.release_date}
                {status.type && (
                  <>
                    {" "}· <span className={status.type === "coming-soon" ? "text-gray-400" : "text-green-400"}>
                      {status.label}
                    </span>
                  </>
                )}
                {series && ` · ${series.name}`}
              </p>

              {body && (
                <div className="mb-6 text-sm leading-relaxed">
                  {body}
                </div>
              )}

              {/* Streaming and Purchase Links */}
              <StreamingLinks
                streamingGroup={streamingGroup}
                purchaseGroup={purchaseGroup}
              />
            </div>
          </div>
        </div>
      </Section>

      {meta.tracks.length > 0 && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <ReleaseTrackList
              releaseTitle={meta.title}
              tracks={meta.tracks.map((t) => ({
                id: t.id,
                title: t.title,
                preview_url: t.preview_url || null,
                duration_seconds: t.duration_seconds || null,
                artists: t.primary_artists.map((id) => ({
                  slug: artistById[id]?.slug ?? id,
                  name: artistById[id]?.name ?? id,
                })),
                position: t.position,
                remix_artists: (t.remix_artists || []).map((id) => ({
                  slug: artistById[id]?.slug ?? id,
                  name: artistById[id]?.name ?? id,
                })),
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
