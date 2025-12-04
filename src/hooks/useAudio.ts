"use client";

import { useInternalAudio, Track } from "../components/audio/AudioProvider";

export default function useAudio() {
  const ctx = useInternalAudio();

  // convenience: play release object
  const playRelease = (release: { preview_url?: string | null; title?: string; artist?: string; id?: string }) => {
    if (!release?.preview_url) return;
    const track: Track = {
      id: release.id,
      url: release.preview_url,
      title: release.title,
      artist: release.artist,
      source: release.id,
    };
    ctx.playTrack(track);
  };

  const playMixtape = (mixtape: { embed_url?: string | null; title?: string; artist?: string; id?: string }) => {
    // If there's a direct preview URL, use it. Otherwise use embed if allowed.
    if (mixtape?.embed_url) {
      const track: Track = {
        id: mixtape.id,
        url: mixtape.embed_url,
        title: mixtape.title,
        artist: mixtape.artist,
        source: mixtape.id,
      };
      ctx.playTrack(track);
    }
  };

  return {
    ...ctx,
    playRelease,
    playMixtape,
  };
}
