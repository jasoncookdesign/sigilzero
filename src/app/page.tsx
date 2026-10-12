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
import PageContextTracker from "../components/tracking/PageContextTracker";

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
  const connectLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/SIGIL.ZERO.RECORDS",
      icon: "/assets/images/icons/icon-instagram.svg",
    },
    {
      label: "Spotify",
      href: "https://open.spotify.com/playlist/1c8DRAbNmp9r93gduwIrVC",
      icon: "/assets/images/icons/icon-spotify.svg",
    },
    {
      label: "Beatport",
      href: "https://www.beatport.com/label/sigilzero/361999",
      icon: "/assets/images/icons/icon-beatport.svg",
    },
    {
      label: "SoundCloud",
      href: "https://soundcloud.com/sigil-zero",
      icon: "/assets/images/icons/icon-soundcloud.svg",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/SIGIL.ZERO",
      icon: "/assets/images/icons/icon-facebook.svg",
    },
  ] as const;

  const releases = loadAllReleases();
  const mixtapes = loadAllMixtapes();
  const artists = loadAllArtists();
  const seriesDocs = loadAllSeries();
  const seriesRegistry = loadSeriesRegistry();

  // Flag to show/hide mixtapes section
  const SHOW_MIXTAPES = false;

  const sortedActiveReleases = sortByDateDesc(releases, "release_date")
    .filter((r) => r.meta.active);

  const newReleases = sortedActiveReleases
    .filter((r) => r.meta.status !== "upcoming")
    .slice(0, 4);

  const comingSoonReleases = sortByDateDesc(releases, "release_date")
    .filter((r) => r.meta.active && r.meta.status === "upcoming")
    .reverse()
    .slice(0, 4);
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
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      return ao - bo;
    });

  const featuredArtists = artists
    .map((a) => a.meta)
    .filter((a) => a.active);

  return (
    <div className="flex flex-col gap-0">
      <PageContextTracker pageType="home" />
      {/* HERO */}
      <Section className="text-center home-hero-bg">
        <div className="relative z-10 px-4 container-sigil sm:px-6 lg:px-8">
          <h1 className="flex items-center justify-center mb-3">
            <span className="sr-only">SIGIL.ZERO</span>
            <img
              src="./assets/images/site_elements/logos/SZLogo_wide-Wtrans-1600.png"
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

          <div className="mt-4 flex items-center justify-center gap-2.5">
            {connectLinks.map((link) => (
              <a
                key={`hero-${link.label}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex items-center justify-center text-white transition-colors duration-200 border border-gray-600 rounded-full group h-9 w-9 hover:border-white hover:bg-white hover:text-black"
                data-track="true"
                data-entity="social"
                data-action="click"
                data-target="social_link"
                data-platform={link.label.toLowerCase() === "beatport" ? "beatport" : link.label.toLowerCase()}
                data-section="header"
              >
                <img
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 invert transition-[filter] duration-200 group-hover:invert-0"
                />
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* LATEST RELEASES */}
      {(newReleases.length > 0 || comingSoonReleases.length > 0) && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">

            {/* New Releases */}
            {newReleases.length > 0 && (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <Link href="/releases">
                    <h2 className="transition-colors h-md hover:text-gray-300">
                      New Releases
                    </h2>
                  </Link>

                  <Link
                    href="/releases"
                    className="text-xs opacity-80"
                  >
                    View all releases →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {newReleases.map((release) => (
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
              </>
            )}

            {/* Coming Soon */}
            {comingSoonReleases.length > 0 && (
              <div className={newReleases.length > 0 ? "mt-12" : ""}>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="h-md">Coming Soon</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {comingSoonReleases.map((release) => (
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
            )}

          </div>
        </Section>
      )}

      {/* LATEST MIXTAPES */}
      {SHOW_MIXTAPES && latestMixtapes.length > 0 && (
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
          <h2 className="mb-4 h-md">Connect</h2>

          <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {connectLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 border border-gray-600 rounded-full group hover:border-white hover:bg-white hover:text-black"
                data-track="true"
                data-entity="social"
                data-action="click"
                data-target="social_link"
                data-platform={link.label.toLowerCase() === "beatport" ? "beatport" : link.label.toLowerCase()}
                data-section="header"
              >
                <img
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 invert transition-[filter] duration-200 group-hover:invert-0"
                />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

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
                <Link
                  href="/press-kit"
                  className="text-white hover:underline"
                  data-track="true"
                  data-entity="press"
                  data-action="click"
                  data-target="press_kit"
                  data-cta-type="press"
                >
                  press kit
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
