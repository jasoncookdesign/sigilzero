"use client";

import React from "react";
import useAudio from "../../hooks/useAudio";

type TrackProps = {
  id: string;
  title: string;
  preview_url?: string | null | undefined;
  duration_seconds?: number | null | undefined;
  artists?: string[];
  position?: number;
  remix_artists?: string[];
  bpm?: number | null;
  key?: string | null;
};

function formatDuration(s?: number | null) {
  if (!s || !isFinite(s)) return "";
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function ReleaseTrackList({
  tracks,
  releaseTitle,
}: {
  tracks: TrackProps[];
  releaseTitle?: string;
}) {
  const audio = useAudio();

  const sorted = tracks
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const mapped = sorted.map((t) => ({
    id: t.id,
    url: t.preview_url || "",
    title: t.title,
    artist: (t.artists || []).join(", ") || releaseTitle || "SIGIL.ZERO",
    remix_artists: t.remix_artists || [],
    bpm: t.bpm,
    key: t.key,
  }));

  const playAll = (start = 0) => {
    const playlist = mapped.filter((m) => m.url).map((m) => ({ id: m.id, url: m.url, title: m.title, artist: m.artist }));
    if (playlist.length === 0) return;
    audio.playPlaylist(playlist, start);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="h-md">Tracklist</h2>
        <div>
          <button
            onClick={() => playAll(0)}
            className="px-3 py-1 text-sm bg-white text-black rounded"
          >
            Play all
          </button>
        </div>
      </div>

      <ol className="divide-y divide-gray-800 rounded-md overflow-hidden">
        {mapped.map((t, i) => {
          const isCurrent = audio.current?.id === t.id;
          return (
            <li key={t.id} className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors ${isCurrent ? "bg-gray-800 border-l-4 border-white" : "bg-gray-900 hover:bg-gray-800"}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 text-xs text-gray-400">{i + 1}</div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{t.title}</div>
                <div className="text-xs text-gray-400 truncate">{t.artist}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {t.remix_artists && t.remix_artists.length > 0 && (
                      <span>Remix: {t.remix_artists.join(", ")}</span>
                    )}
                  </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400">{formatDuration(tracks[i]?.duration_seconds)}</div>
                {t.url ? (
                  <button
                    onClick={() => {
                      if (isCurrent && audio.playing) audio.pause();
                      else playAll(i);
                    }}
                    className={`px-2 py-1 text-sm bg-gray-100 text-black rounded transform transition-transform duration-150 ${isCurrent && audio.playing ? "scale-105 shadow-md" : "hover:scale-105"}`}
                  >
                    {isCurrent && audio.playing ? "❚❚" : "▶ Play"}
                  </button>
                ) : (
                  <div className="text-xs text-gray-500">No preview</div>
                )}
                {/* metadata badges */}
                <div className="flex items-center gap-2 ml-2">
                  {t.bpm ? <div className="text-xs text-gray-400">{t.bpm} BPM</div> : null}
                  {t.key ? <div className="text-xs text-gray-400">{t.key}</div> : null}
                </div>
            </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
