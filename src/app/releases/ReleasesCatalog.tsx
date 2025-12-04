"use client";

import { useMemo, useState } from "react";

import type { ReleaseDocument } from "../../lib/content/load-releases";
import type { SeriesRegistryItem } from "../../lib/content/load-series-registry";
import type { ArtistDocument } from "../../lib/content/load-artists";
import { filterReleases } from "../../lib/filters/releases";
import ReleaseCard from "../../components/cards/ReleaseCard";

type Props = {
  releases: ReleaseDocument[];
  seriesRegistry: SeriesRegistryItem[];
  artists: ArtistDocument[];
};

export default function ReleasesCatalog({
  releases,
  seriesRegistry,
  artists,
}: Props) {
  const [query, setQuery] = useState("");
  const [seriesId, setSeriesId] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [artistId, setArtistId] = useState<string>("all");

  const seriesById = useMemo(
    () => Object.fromEntries(seriesRegistry.map((s) => [s.id, s])),
    [seriesRegistry]
  );

  const artistById = useMemo(
    () => Object.fromEntries(artists.map((a) => [a.meta.id, a.meta])),
    [artists]
  );

  const filtered = useMemo(() => {
    return filterReleases(releases, {
      query,
      seriesIds: seriesId === "all" ? undefined : [seriesId],
      types: type === "all" ? undefined : [type],
      artistIds: artistId === "all" ? undefined : [artistId],
    });
  }, [releases, query, seriesId, type, artistId]);

  const allTypes = Array.from(new Set(releases.map((r) => r.meta.type))).sort();
  const allArtists = artists
    .map((a) => a.meta)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h2 className="text-4xl mb-4 text-center">
        Releases
      </h2>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search title or catalog #"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm"
        />

        {/* Series */}
        <select
          aria-label="Filter by series"
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm"
        >
          <option value="all">All series</option>
          {seriesRegistry.map((s) => (
            <option key={s.id} value={s.id}>
              {s.short_label ?? s.name}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm"
        >
          <option value="all">All types</option>
          {allTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

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
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ meta }) => {
          const series = seriesById[meta.series_id] ?? null;
          return <ReleaseCard key={meta.id} release={meta} series={series} />;
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-4 text-sm opacity-70">
          No releases match the current filters.
        </p>
      )}
    </div>
  );
}
