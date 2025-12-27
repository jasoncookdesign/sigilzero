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

  const latestReleases = sortByDateDesc(releases, "release_date")
    .filter((r) => r.meta.active)
    .slice(0, 2);
  const latestMixtapes = sortByDateDesc(mixtapes, "date")
    .filter((m) => m.meta.active)
    .slice(0, 2);

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
    .filter((a) => a.active);

  return (
    <div className="flex flex-col gap-0">
      {/* HERO */}
      <Section className="text-center home-hero-bg">
        <div className="relative z-10 px-4 container-sigil sm:px-6 lg:px-8">
          <h1 className="flex items-center justify-center mb-3">
            <span className="sr-only">SIGIL.ZERO</span>
            <img
              src="./assets/images/site_elements/logos/SZLogo_wide-WonB-1600.png"
              alt=""
              aria-hidden="true"
              className="w-auto h-fit"
            />
          </h1>

          <p className="max-w-lg mx-auto mb-6 text-sm leading-relaxed text-muted">
            An electronic music imprint focused on dark, high–impact club records. Curated for DJs and listeners who want system-ready tracks with a distinct edge.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/releases"
              className="text-sm btn btn-primary"
            >
              View catalog
            </Link>
            <Link
              href="/artists"
              className="text-sm btn btn-secondary opacity-85"
            >
              Explore the roster
            </Link>
          </div>
        </div>
      </Section>

      {/* LATEST RELEASES */}
      {latestReleases.length > 0 && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-3">
              <Link href="/releases">
                <h2 className="transition-colors h-md hover:text-gray-300">
                  Latest Releases
                </h2>
              </Link>

              <Link
                href="/releases"
                className="text-xs opacity-80"
              >
                View all releases →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {latestReleases.map((release) => (
                <ReleaseCard
                  key={release.meta.slug}
                  release={release.meta}
                  series={
                    seriesRegistry.find(
                      (s) => s.id === release.meta.series_id
                    ) ?? null
                  }
                  artists={artists.map(a => a.meta)}
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* LATEST MIXTAPES */}
      {latestMixtapes.length > 0 && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-3">
              <Link href="/mixtapes">
                <h2 className="transition-colors h-md hover:text-gray-300">
                  Latest Mixtapes
                </h2>
              </Link>

              <Link
                href="/mixtapes"
                className="text-xs opacity-80"
              >
                View all mixtapes →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {latestMixtapes.map((mixtape) => (
                <MixtapeCard
                  key={mixtape.meta.slug}
                  mixtape={mixtape.meta}
                  artist={artistById[mixtape.meta.artist_id] ?? null}
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* SERIES OVERVIEW */}
      {activeSeries.length > 0 && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <Link href="/series">
              <h2 className="mb-3 transition-colors h-md hover:text-gray-300">
                Label Series
              </h2>
            </Link>

            <p className="max-w-lg mb-4 text-sm leading-relaxed text-muted">
              SIGIL.ZERO is organized into a small set of curated series, each
              with its own flavor and use-case on the dancefloor. Think of them as
              sigils for different kinds of nights.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeSeries.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ARTISTS */}
      {featuredArtists.length > 0 && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-3">
              <Link href="/artists">
                <h2 className="transition-colors h-md hover:text-gray-300">
                  Artists
                </h2>
              </Link>

              <Link
                href="/artists"
                className="text-xs opacity-80"
              >
                View artists →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* PRESS / DEMO CTA */}
      <Section>
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                For producers & remixers
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Want to release your track on SIGIL.ZERO? Read the label ethos on the{" "}
                <Link href="/about" className="text-white hover:underline">about page</Link> and watch for demo
                submission details.
              </p>
            </div>
 
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                For press & promoters
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Need a quick overview, key links, or assets? Start with the{" "}
                <Link href="/press-kit" className="text-white hover:underline">press kit</Link>.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
