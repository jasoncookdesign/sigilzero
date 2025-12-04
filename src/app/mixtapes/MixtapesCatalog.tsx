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
      <h2 className="text-4xl mb-4 text-center">
        Mixtapes
      </h2>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search title, event, or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm"
        />

        {/* Artist */}
        <select
          aria-label="Filter by artist"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm"
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
          aria-label="Filter by platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ meta }) => {
          const artist = artistById[meta.artist_id] ?? null;
          return <MixtapeCard key={meta.id} mixtape={meta} artist={artist} />;
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-4 text-sm opacity-70">
          No mixtapes match the current filters.
        </p>
      )}
    </div>
  );
}
