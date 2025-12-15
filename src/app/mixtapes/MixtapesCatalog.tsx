"use client";

import { useMemo, useState } from "react";

import type { MixtapeDocument } from "../../lib/content/load-mixtapes";
import type { ArtistDocument } from "../../lib/content/load-artists";
import { filterMixtapes } from "../../lib/filters/mixtapes";
import MixtapeCard from "../../components/cards/MixtapeCard";
import Section from "../../components/Section";

type Props = {
  mixtapes: MixtapeDocument[];
  artists: ArtistDocument[];
};

export default function MixtapesCatalog({ mixtapes, artists }: Props) {
  const [query, setQuery] = useState("");
  const [artistId, setArtistId] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [genres, setGenres] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [year, setYear] = useState<string>("all");

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

  const allGenres = useMemo(
    () =>
      Array.from(
        new Set(mixtapes.flatMap((m) => m.meta.genres))
      ).sort(),
    [mixtapes]
  );

  const allMoods = useMemo(
    () =>
      Array.from(
        new Set(mixtapes.flatMap((m) => m.meta.moods))
      ).sort(),
    [mixtapes]
  );

  const allTags = useMemo(
    () =>
      Array.from(
        new Set(mixtapes.flatMap((m) => m.meta.tags))
      ).sort(),
    [mixtapes]
  );

  const allYears = useMemo(
    () =>
      Array.from(
        new Set(
          mixtapes.map((m) => new Date(m.meta.date).getFullYear())
        )
      ).sort((a, b) => b - a),
    [mixtapes]
  );

  const filtered = useMemo(
    () =>
      filterMixtapes(mixtapes, {
        query,
        artistIds: artistId === "all" ? undefined : [artistId],
        platforms: platform === "all" ? undefined : [platform],
        genres: genres.length > 0 ? genres : undefined,
        moods: moods.length > 0 ? moods : undefined,
        tags: tags.length > 0 ? tags : undefined,
        year: year === "all" ? undefined : parseInt(year, 10),
      }),
    [mixtapes, query, artistId, platform, genres, moods, tags, year]
  );

  const isFiltered =
    query ||
    artistId !== "all" ||
    platform !== "all" ||
    genres.length > 0 ||
    moods.length > 0 ||
    tags.length > 0 ||
    year !== "all";

  const clearFilters = () => {
    setQuery("");
    setArtistId("all");
    setPlatform("all");
    setGenres([]);
    setMoods([]);
    setTags([]);
    setYear("all");
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

  const toggleTag = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <Section>
      <div className="container-sigil px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl mb-6 text-center">
          Mixtapes
        </h2>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search titles, events, locations, or artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-950 text-sm focus:outline-none focus:border-gray-600"
          />
        </div>

      {/* Dropdown filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {/* Artist */}
        <select
          aria-label="Filter by artist"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm focus:outline-none focus:border-gray-600"
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
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm focus:outline-none focus:border-gray-600"
        >
          <option value="all">All platforms</option>
          {allPlatforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          aria-label="Filter by year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-950 text-sm focus:outline-none focus:border-gray-600"
        >
          <option value="all">All years</option>
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Genre pills */}
      {allGenres.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
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
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
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

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  tags.includes(t)
                    ? "bg-white text-black border border-white"
                    : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters display and clear button */}
      {isFiltered && (
        <div className="mb-6 p-3 bg-gray-900 rounded border border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-300">
              Showing <span className="font-semibold">{filtered.length}</span> of{" "}
              <span className="font-semibold">{mixtapes.length}</span> mixtapes
            </div>
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ meta }) => {
          const artist = artistById[meta.artist_id] ?? null;
          return <MixtapeCard key={meta.id} mixtape={meta} artist={artist} />;
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-4 text-sm opacity-70">
          No mixtapes match the current filters. <button onClick={clearFilters} className="underline hover:text-white">Clear filters</button>
        </p>
      )}
      </div>
    </Section>
  );
}
