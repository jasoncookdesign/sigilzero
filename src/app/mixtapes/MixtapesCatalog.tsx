"use client";

import { useMemo, useState } from "react";

import type { MixtapeDocument } from "../../lib/content/load-mixtapes";
import type { ArtistDocument } from "../../lib/content/load-artists";
import { filterMixtapes } from "../../lib/filters/mixtapes";
import MixtapeCard from "../../components/cards/MixtapeCard";

type Props = {
  mixtapes: MixtapeDocument[];
  artists: ArtistDocument[];
};

export default function MixtapesCatalog({ mixtapes, artists }: Props) {
  const [query, setQuery] = useState("");
  const [artistId, setArtistId] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");

  const artistById = useMemo(
    () => Object.fromEntries(artists.map((a) => [a.meta.id, a.meta])),
    [artists]
  );

  const allArtists = useMemo(
    () =>
      artists
        .map((a) => a.meta)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [artists]
  );

  const allPlatforms = useMemo(
    () =>
      Array.from(new Set(mixtapes.map((m) => m.meta.platform))).sort(),
    [mixtapes]
  );

  const filtered = useMemo(
    () =>
      filterMixtapes(mixtapes, {
        query,
        artistIds: artistId === "all" ? undefined : [artistId],
        platforms: platform === "all" ? undefined : [platform],
      }),
    [mixtapes, query, artistId, platform]
  );

  return (
    <div>
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Mixtapes
      </h2>

      {/* Filter bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) repeat(2, minmax(0, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search title, event, or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#050505",
            color: "inherit",
            fontSize: "0.9rem",
          }}
        />

        {/* Artist */}
        <select
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#050505",
            color: "inherit",
            fontSize: "0.9rem",
          }}
        >
          <option value="all">All artists</option>
          {allArtists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* Platform */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#050505",
            color: "inherit",
            fontSize: "0.9rem",
          }}
        >
          <option value="all">All platforms</option>
          {allPlatforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filtered.map(({ meta }) => {
          const artist = artistById[meta.artist_id] ?? null;
          return <MixtapeCard key={meta.id} mixtape={meta} artist={artist} />;
        })}
      </div>

      {filtered.length === 0 && (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            opacity: 0.7,
          }}
        >
          No mixtapes match the current filters.
        </p>
      )}
    </div>
  );
}
