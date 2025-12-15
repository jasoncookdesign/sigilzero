// src/app/page.tsx

import Link from "next/link";

import { loadAllReleases } from "../lib/content/load-releases";
import { loadAllMixtapes } from "../lib/content/load-mixtapes";
import { loadAllArtists } from "../lib/content/load-artists";
import { loadAllSeries } from "../lib/content/load-series";
import { loadSeriesRegistry } from "../lib/content/load-series-registry";

import ReleaseCard from "../components/cards/ReleaseCard";
import MixtapeCard from "../components/cards/MixtapeCard";
import ArtistCard from "../components/cards/ArtistCard";
import SeriesCard from "../components/cards/SeriesCard";
import Section from "../components/Section";

function sortByDateDesc<T extends { meta: { release_date?: string; date?: string } }>(
  items: T[],
  field: "release_date" | "date"
): T[] {
  return items.slice().sort((a, b) => {
    const da = a.meta[field] ? new Date(a.meta[field] as string).getTime() : 0;
    const db = b.meta[field] ? new Date(b.meta[field] as string).getTime() : 0;
    return db - da;
  });
}

export default function HomePage() {
  const releases = loadAllReleases();
  const mixtapes = loadAllMixtapes();
  const artists = loadAllArtists();
  const seriesDocs = loadAllSeries();
  const seriesRegistry = loadSeriesRegistry();

  const latestRelease = sortByDateDesc(releases, "release_date")[0] ?? null;
  const latestMixtape = sortByDateDesc(mixtapes, "date")[0] ?? null;

  const artistById = Object.fromEntries(
    artists.map((a) => [a.meta.id, a.meta])
  );

  const activeSeries = seriesDocs
    .map((doc) => doc.meta)
    .filter((s) => s.active)
    .sort((a, b) => {
      const ao = (a as any).order ?? 0;
      const bo = (b as any).order ?? 0;
      return ao - bo;
    });

  const featuredArtists = artists
    .map((a) => a.meta)
    .slice(0, 4)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-0">
      {/* HERO */}
      <Section className="text-center">
        <div className="container-sigil px-4 sm:px-6 lg:px-8">
          <h1 className="h-display mb-3 text-white uppercase">
            SIGIL.ZERO
          </h1>

          <p className="text-sm text-muted max-w-lg mx-auto mb-6 leading-relaxed">
            An occult-leaning electronic music imprint focused on dark, hypnotic,
            high–impact club records. Curated for DJs and listeners who want
            system-ready tracks with a distinct edge.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/releases"
              className="btn btn-primary text-sm"
            >
              View catalog
            </Link>
            <Link
              href="/artists"
              className="btn btn-secondary text-sm opacity-85"
            >
              Explore the roster
            </Link>
          </div>
        </div>
      </Section>

      {/* LATEST RELEASE */}
      {latestRelease && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="h-md">
                Latest Release
              </h2>

              <Link
                href="/releases"
                className="text-xs opacity-80"
              >
                View all releases →
              </Link>
            </div>

            <div className="max-w-xs">
              <ReleaseCard
                release={latestRelease.meta}
                series={
                  seriesRegistry.find(
                    (s) => s.id === latestRelease.meta.series_id
                  ) ?? null
                }
              />
            </div>
          </div>
        </Section>
      )}

      {/* LATEST MIXTAPE */}
      {latestMixtape && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="h-md">
                Latest Mixtape
              </h2>

              <Link
                href="/mixtapes"
                className="text-xs opacity-80"
              >
                View all mixtapes →
              </Link>
            </div>

            <div className="max-w-md">
              <MixtapeCard
                mixtape={latestMixtape.meta}
                artist={artistById[latestMixtape.meta.artist_id] ?? null}
              />
            </div>
          </div>
        </Section>
      )}

      {/* SERIES OVERVIEW */}
      {activeSeries.length > 0 && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <h2 className="h-md mb-3">
              Label Series
            </h2>

            <p className="text-sm text-muted max-w-lg mb-4 leading-relaxed">
              SIGIL.ZERO is organized into a small set of curated series, each
              with its own flavor and use-case on the dancefloor. Think of them as
              sigils for different kinds of nights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeSeries.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* FEATURED ARTISTS */}
      {featuredArtists.length > 0 && (
        <Section>
          <div className="container-sigil px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="h-md">
                Featured Artists
              </h2>

              <Link
                href="/artists"
                className="text-xs opacity-80"
              >
                View all artists →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* PRESS / DEMO CTA */}
      <section className="border-t border-gray-900 pt-6 mt-2 text-sm text-muted flex flex-wrap gap-4 justify-between">
        <div className="max-w-xs">
          <div className="font-semibold mb-1 text-white">
            For press & promoters
          </div>
          <div>
            Need a quick overview, key links, or assets? Start with the{" "}
            <Link href="/press-kit" className="text-white hover:underline">press kit</Link>.
          </div>
        </div>

        <div className="max-w-xs">
          <div className="font-semibold mb-1 text-white">
            For producers & remixers
          </div>
          <div>
            Want to release with SIGIL.ZERO? Read the label ethos on the{" "}
            <Link href="/about" className="text-white hover:underline">about page</Link> and watch for demo
            submission details.
          </div>
        </div>
      </section>
    </div>
  );
}
