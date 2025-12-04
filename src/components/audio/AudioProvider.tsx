"use client";

import React, { createContext, useCallback, useEffect, useRef, useState } from "react";

export type Track = {
  id?: string | undefined;
  url: string;
  title?: string | undefined;
  artist?: string | undefined;
  source?: string | undefined; // release or mixtape id
};

type AudioContextState = {
  playing: boolean;
  current?: Track | null;
  playlist: Track[];
  index: number;
  currentTime: number;
  duration: number;
  open: boolean;
  playTrack: (track: Track) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  closePlayer: () => void;
  openPlayer: () => void;
};

const AudioContext = createContext<AudioContextState | undefined>(undefined);

export const useInternalAudio = () => {
  const ctx = React.useContext(AudioContext);
  if (!ctx) throw new Error("useInternalAudio must be used within AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("audio-player-state");
      if (saved) {
        const { playlist: savedPlaylist, index: savedIndex, currentTime: savedTime } = JSON.parse(saved);
        if (savedPlaylist && Array.isArray(savedPlaylist)) {
          setPlaylist(savedPlaylist);
          setIndex(savedIndex ?? 0);
          setCurrentTime(savedTime ?? 0);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  // Save state to localStorage whenever playlist/index/currentTime changes
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "audio-player-state",
        JSON.stringify({
          playlist,
          index,
          currentTime: Math.floor(currentTime),
        })
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [playlist, index, currentTime, mounted]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
    }

    const audio = audioRef.current;
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      // advance if playlist
      if (playlist.length > index + 1) {
        setIndex((i) => i + 1);
      } else {
        setPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [index, playlist]);

  // ensure audio src follows current/index
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = playlist[index] ?? current;
    if (!track) return;
    if (audio.src !== track.url) {
      audio.src = track.url;
      audio.currentTime = 0;
      audio.load();
    }
    if (playing) audio.play().catch(() => setPlaying(false));
  }, [index, playlist, current, playing]);

  const playTrack = useCallback((track: Track) => {
    setPlaylist([track]);
    setIndex(0);
    setCurrent(track);
    setOpen(true);
    setPlaying(true);
  }, []);

  const playPlaylist = useCallback((tracks: Track[], startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    setPlaylist(tracks);
    setIndex(Math.max(0, Math.min(startIndex, tracks.length - 1)));
    setCurrent(tracks[startIndex] ?? null);
    setOpen(true);
    setPlaying(true);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause(); else play();
  }, [playing, play, pause]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
    setCurrentTime(audio.currentTime || 0);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      const nextIdx = i + 1;
      if (nextIdx < playlist.length) return nextIdx;
      return i;
    });
  }, [playlist.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, v));
  }, []);

  const closePlayer = useCallback(() => setOpen(false), []);
  const openPlayer = useCallback(() => setOpen(true), []);

  // sync current with playlist index
  useEffect(() => {
    if (playlist.length > 0) {
      setCurrent(playlist[index] ?? null);
    }
  }, [index, playlist]);

  const value: AudioContextState = {
    playing,
    current,
    playlist,
    index,
    currentTime,
    duration,
    open,
    playTrack,
    playPlaylist,
    play,
    pause,
    toggle,
    seek,
    next,
    prev,
    setVolume,
    closePlayer,
    openPlayer,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
