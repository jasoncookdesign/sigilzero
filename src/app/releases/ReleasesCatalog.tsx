"use client";

import { useMemo, useState } from "react";

import type { ReleaseDocument } from "../../lib/content/load-releases";
import type { SeriesRegistryItem } from "../../lib/content/load-series-registry";
import type { ArtistDocument } from "../../lib/content/load-artists";
import { filterReleases } from "../../lib/filters/releases";
import ReleaseCard from "../../components/cards/ReleaseCard";
import Section from "../../components/Section";

type Props = {
  releases: ReleaseDocument[];
  seriesRegistry: SeriesRegistryItem[];
  artists: ArtistDocument[];
  showSeriesFilter?: boolean;
};

export default function ReleasesCatalog({
  releases,
  seriesRegistry,
  artists,
  showSeriesFilter = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [seriesId, setSeriesId] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [artistId, setArtistId] = useState<string>("all");
  const [genres, setGenres] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [year, setYear] = useState<string>("all");
  const [bpmMin, setBpmMin] = useState<string>("");
  const [bpmMax, setBpmMax] = useState<string>("");

  const seriesById = useMemo(
    () => Object.fromEntries(seriesRegistry.map((s) => [s.id, s])),
    [seriesRegistry]
  );

  const artistById = useMemo(
    () => Object.fromEntries(artists.map((a) => [a.meta.id, a.meta])),
    [artists]
  );

  const allTypes = useMemo(
    () => Array.from(new Set(releases.map((r) => r.meta.type))).sort(),
    [releases]
  );

  const allArtists = useMemo(
    () =>
      artists
        .map((a) => a.meta)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [artists]
  );

  const allGenres = useMemo(
    () =>
      Array.from(
        new Set(releases.flatMap((r) => r.meta.genres))
      ).sort(),
    [releases]
  );

  const allMoods = useMemo(
    () =>
      Array.from(
        new Set(releases.flatMap((r) => r.meta.moods))
      ).sort(),
    [releases]
  );

  const allYears = useMemo(
    () =>
      Array.from(
        new Set(
          releases.map((r) => new Date(r.meta.release_date).getFullYear())
        )
      ).sort((a, b) => b - a),
    [releases]
  );

  const filtered = useMemo(() => {
    return filterReleases(releases, {
      query,
      seriesIds: seriesId === "all" ? undefined : [seriesId],
      types: type === "all" ? undefined : [type],
      artistIds: artistId === "all" ? undefined : [artistId],
      genres: genres.length > 0 ? genres : undefined,
      moods: moods.length > 0 ? moods : undefined,
      year: year === "all" ? undefined : parseInt(year, 10),
      bpmMin: bpmMin ? parseInt(bpmMin, 10) : undefined,
      bpmMax: bpmMax ? parseInt(bpmMax, 10) : undefined,
    });
  }, [releases, query, seriesId, type, artistId, genres, moods, year, bpmMin, bpmMax]);

  const isFiltered =
    query ||
    seriesId !== "all" ||
    type !== "all" ||
    artistId !== "all" ||
    genres.length > 0 ||
    moods.length > 0 ||
    year !== "all" ||
    bpmMin ||
    bpmMax;

  const clearFilters = () => {
    setQuery("");
    setSeriesId("all");
    setType("all");
    setArtistId("all");
    setGenres([]);
    setMoods([]);
    setYear("all");
    setBpmMin("");
    setBpmMax("");
  };

  const toggleGenre = (g: string) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const toggleMood = (m: string) => {
    setMoods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  return (
    <Section>
      <div className="px-4 container-sigil sm:px-6 lg:px-8">
        <h1 className="mb-6 text-center text-white h-display" data-testid="releases-page-title">Releases</h1>
 
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search titles, catalog #, tracks, or artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
          />
        </div>

      {/* Dropdown filters - Row 1 */}
      <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Series */}
        {showSeriesFilter && (
          <select
            aria-label="Filter by series"
            value={seriesId}
            onChange={(e) => setSeriesId(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
          >
            <option value="all">All series</option>
            {seriesRegistry.map((s) => (
              <option key={s.id} value={s.id}>
                {s.short_label ?? s.name}
              </option>
            ))}
          </select>
        )}

        {/* Type */}
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
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
          className="px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
        >
          <option value="all">All artists</option>
          {allArtists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          aria-label="Filter by year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
        >
          <option value="all">All years</option>
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* BPM range filters */}
      <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2">
        <input
          type="number"
          placeholder="Min BPM"
          value={bpmMin}
          onChange={(e) => setBpmMin(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
          min="0"
          max="300"
        />
        <input
          type="number"
          placeholder="Max BPM"
          value={bpmMax}
          onChange={(e) => setBpmMax(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
          min="0"
          max="300"
        />
      </div>

      {/* Genre pills */}
      {allGenres.length > 0 && (
        <div className="mb-4">
          <label className="block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
            Genres
          </label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  genres.includes(g)
                    ? "bg-white text-black border border-white"
                    : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mood pills */}
      {allMoods.length > 0 && (
        <div className="mb-4">
          <label className="block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
            Moods
          </label>
          <div className="flex flex-wrap gap-2">
            {allMoods.map((m) => (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  moods.includes(m)
                    ? "bg-white text-black border border-white"
                    : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters display and clear button */}
      {isFiltered && (
        <div className="p-3 mb-6 bg-gray-900 border border-gray-800 rounded">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="text-sm text-gray-300">
              Showing <span className="font-semibold">{filtered.length}</span> of{" "}
              <span className="font-semibold">{releases.length}</span> releases
            </div>
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-white transition-colors bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ meta }) => {
          const series = seriesById[meta.series_id] ?? null;
          return <ReleaseCard key={meta.id} release={meta} series={series} />;
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-4 text-sm opacity-70">
          No releases match the current filters. <button onClick={clearFilters} className="underline hover:text-white">Clear filters</button>
        </p>
      )}
      </div>
    </Section>
  );
}
