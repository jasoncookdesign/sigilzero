"use client";

import React, { useMemo, useState } from "react";
import { useInternalAudio, Track } from "./AudioProvider";

function formatTime(s: number) {
  if (!isFinite(s) || s <= 0) return "0:00";
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

// Simple waveform visualization (bars based on progress)
function SimpleWaveform({ progress }: { progress: number }) {
  const bars = 20;
  return (
    <div className="flex items-end justify-center gap-0.5 h-6">
      {Array.from({ length: bars }).map((_, i) => {
        const heightPercent = Math.random() * 60 + 20;
        const isPlayed = i / bars < progress;
        const heightClass =
          heightPercent < 30
            ? "h-2"
            : heightPercent < 50
              ? "h-4"
              : "h-5";
        return (
          <div
            key={i}
            className={`w-0.5 rounded-full transition-colors ${isPlayed ? "bg-white" : "bg-gray-600"} ${heightClass}`}
          />
        );
      })}
    </div>
  );
}

export default function AudioPlayer() {
  const ctx = useInternalAudio();
  const { current, playing, toggle, currentTime, duration, seek, next, prev, playlist, open, closePlayer } = ctx;
  const [seeking, setSeeking] = useState(false);

  const progress = useMemo(() => {
    if (!duration || duration === 0) return 0;
    return Math.max(0, Math.min(1, currentTime / duration));
  }, [currentTime, duration]);

  if (!current) return null;

  return (
    <div
      className={`fixed left-4 right-4 bottom-4 z-50 transform transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}`}
      aria-live="polite"
    >
      <div className="bg-black/90 border border-gray-800 rounded-lg backdrop-blur-md shadow-lg overflow-hidden hover:border-gray-700 transition-colors">
        {/* Waveform */}
        <div className="px-4 pt-2 pb-1">
          <SimpleWaveform progress={progress} />
        </div>

        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{current.title ?? "Unknown track"}</div>
            <div className="text-xs text-gray-400 truncate">{current.artist ?? "SIGIL.ZERO"}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="p-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              disabled={playlist.length <= 1}
            >
              ◀◀
            </button>

            <button
              onClick={toggle}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors transform hover:scale-110"
            >
              {playing ? "❚❚" : "▶"}
            </button>

            <button
              onClick={next}
              className="p-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              disabled={playlist.length <= 1}
            >
              ▶▶
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-12 text-right">{formatTime(currentTime)}</div>
            <div className="flex-1">
              <input
                aria-label="seek"
                type="range"
                min={0}
                max={duration || 0}
                step={0.01}
                value={seeking ? undefined : currentTime}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSeeking(true);
                  seek(v);
                }}
                onMouseUp={() => setSeeking(false)}
                onTouchEnd={() => setSeeking(false)}
                className="w-full cursor-pointer hover:accent-white"
              />
            </div>
            <div className="w-12 text-left">{formatTime(duration)}</div>
          </div>
        </div>

        <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between">
          <div className="text-xs text-gray-400">{playlist.length > 1 ? `${ctx.index + 1}/${playlist.length}` : ""}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => ctx.setVolume?.(0)} className="text-gray-400 text-xs hover:text-white transition-colors">
              Mute
            </button>
            <button onClick={closePlayer} className="text-gray-400 text-xs hover:text-white transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
