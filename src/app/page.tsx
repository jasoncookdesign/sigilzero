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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
      }}
    >
      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "2rem 0 1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          SIGIL.ZERO
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            opacity: 0.85,
            maxWidth: "560px",
            margin: "0 auto 1.5rem",
            lineHeight: 1.6,
          }}
        >
          An occult-leaning electronic music imprint focused on dark, hypnotic,
          high–impact club records. Curated for DJs and listeners who want
          system-ready tracks with a distinct edge.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/releases"
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "999px",
              border: "1px solid #fff",
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            View catalog
          </Link>
          <Link
            href="/artists"
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "999px",
              border: "1px solid #444",
              fontSize: "0.9rem",
              textDecoration: "none",
              opacity: 0.85,
            }}
          >
            Explore the roster
          </Link>
        </div>
      </section>

      {/* LATEST RELEASE */}
      {latestRelease && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
              }}
            >
              Latest Release
            </h2>

            <Link
              href="/releases"
              style={{
                fontSize: "0.85rem",
                opacity: 0.8,
                textDecoration: "none",
              }}
            >
              View all releases →
            </Link>
          </div>

          <div
            style={{
              maxWidth: "420px",
            }}
          >
            <ReleaseCard
              release={latestRelease.meta}
              series={
                seriesRegistry.find(
                  (s) => s.id === latestRelease.meta.series_id
                ) ?? null
              }
            />
          </div>
        </section>
      )}

      {/* LATEST MIXTAPE */}
      {latestMixtape && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
              }}
            >
              Latest Mixtape
            </h2>

            <Link
              href="/mixtapes"
              style={{
                fontSize: "0.85rem",
                opacity: 0.8,
                textDecoration: "none",
              }}
            >
              View all mixtapes →
            </Link>
          </div>

          <div
            style={{
              maxWidth: "540px",
            }}
          >
            <MixtapeCard
              mixtape={latestMixtape.meta}
              artist={artistById[latestMixtape.meta.artist_id] ?? null}
            />
          </div>
        </section>
      )}

      {/* SERIES OVERVIEW */}
      {activeSeries.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "1.4rem",
              marginBottom: "0.75rem",
            }}
          >
            Label Series
          </h2>

          <p
            style={{
              fontSize: "0.9rem",
              opacity: 0.8,
              maxWidth: "520px",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}
          >
            SIGIL.ZERO is organized into a small set of curated series, each
            with its own flavor and use-case on the dancefloor. Think of them as
            sigils for different kinds of nights.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {activeSeries.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURED ARTISTS */}
      {featuredArtists.length > 0 && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
              }}
            >
              Featured Artists
            </h2>

            <Link
              href="/artists"
              style={{
                fontSize: "0.85rem",
                opacity: 0.8,
                textDecoration: "none",
              }}
            >
              View all artists →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* PRESS / DEMO CTA */}
      <section
        style={{
          borderTop: "1px solid #111",
          paddingTop: "1.5rem",
          marginTop: "0.5rem",
          fontSize: "0.9rem",
          opacity: 0.85,
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: "420px" }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: "0.25rem",
            }}
          >
            For press & promoters
          </div>
          <div>
            Need a quick overview, key links, or assets? Start with the{" "}
            <Link href="/press-kit">press kit</Link>.
          </div>
        </div>

        <div style={{ maxWidth: "420px" }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: "0.25rem",
            }}
          >
            For producers & remixers
          </div>
          <div>
            Want to release with SIGIL.ZERO? Read the label ethos on the{" "}
            <Link href="/about">about page</Link> and watch for demo
            submission details.
          </div>
        </div>
      </section>
    </div>
  );
}
