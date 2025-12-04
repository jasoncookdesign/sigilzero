"use client";

import React, { useState } from "react";
import useAudio from "../../hooks/useAudio";

export default function MixtapePlayButton({
  embedUrl,
  title,
  id,
  artist,
}: {
  embedUrl?: string | null;
  title?: string;
  id?: string;
  artist?: string;
}) {
  const audio = useAudio();
  const [open, setOpen] = useState(false);

  const isDirectAudio = (u?: string | null) => {
    if (!u) return false;
    return /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(u);
  };

  const onPlay = () => {
    if (!embedUrl) return;
    if (isDirectAudio(embedUrl)) {
      audio.playMixtape({ embed_url: embedUrl, title: title ?? "Mixtape", artist: artist ?? "SIGIL.ZERO", id: id ?? "mixtape" });
    } else {
      // open iframe modal to let the embed control playback
      setOpen(true);
    }
  };

  return (
    <div className="mb-4">
      <button onClick={onPlay} className="px-3 py-2 bg-white text-black rounded mr-3">
        ▶ Play Mixtape
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-3xl bg-black border border-gray-800 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white">{title}</div>
              <button onClick={() => setOpen(false)} className="text-gray-300">Close</button>
            </div>
            <div className="w-full aspect-video">
              <iframe src={embedUrl ?? ""} title={title} className="w-full h-full border-0" allow="autoplay" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
