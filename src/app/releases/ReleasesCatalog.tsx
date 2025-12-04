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
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Releases
      </h2>

      {/* Filter bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search title or catalog #"
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

        {/* Series */}
        <select
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#050505",
            color: "inherit",
            fontSize: "0.9rem",
          }}
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
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#050505",
            color: "inherit",
            fontSize: "0.9rem",
          }}
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
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filtered.map(({ meta }) => {
          const series = seriesById[meta.series_id] ?? null;
          return <ReleaseCard key={meta.id} release={meta} series={series} />;
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
          No releases match the current filters.
        </p>
      )}
    </div>
  );
}
