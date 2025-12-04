import { notFound } from "next/navigation";

import {
  loadAllArtists,
  loadArtistBySlug,
} from "../../../lib/content/load-artists";
import { loadAllReleases } from "../../../lib/content/load-releases";
import { loadAllMixtapes } from "../../../lib/content/load-mixtapes";
import { safeGetInstagramPosts } from "../../../lib/instagram/fetch-posts";
import InstagramFeed from "../../../components/artists/InstagramFeed";

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

  // Fetch Instagram posts if handle is available
  const instagramPosts = meta.instagram_handle
    ? await safeGetInstagramPosts(meta.instagram_handle, 3)
    : [];

  return (
    <div>
      <h1 className="text-4xl mb-2">
        {meta.name}
      </h1>

      {meta.location && (
        <p className="text-sm text-muted mb-3">
          {meta.location}
        </p>
      )}

      {body && (
        <div className="text-sm leading-relaxed mb-6">
          {body}
        </div>
      )}

      {instagramPosts && instagramPosts.length > 0 && (
        <div className="mb-8">
          <InstagramFeed posts={instagramPosts} />
        </div>
      )}

      {releases.length > 0 && (
        <section className="mt-6">
          <h2 className="h-md mb-3">
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
        <section className="mt-6">
          <h2 className="h-md mb-3">
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
