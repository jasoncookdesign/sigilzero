"use client";

import React, { useState } from "react";
import Link from "next/link";
import SpotifyPlayer from "./SpotifyPlayer";

type ArtistRef = {
  slug: string;
  name: string;
};

type TrackProps = {
  id: string;
  title: string;
  preview_url?: string | null | undefined;
  duration_seconds?: number | null | undefined;
  artists?: ArtistRef[];
  position?: number;
  remix_artists?: ArtistRef[];
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
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);

  const sorted = tracks
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const mapped = sorted.map((t) => ({
    id: t.id,
    url: t.preview_url || "",
    title: t.title,
    artist: (t.artists || []).map(a => a.name).join(", ") || releaseTitle || "SIGIL.ZERO",
    artists: t.artists || [],
    remix_artists: t.remix_artists || [],
    bpm: t.bpm,
    key: t.key,
  }));

  // Check if any tracks have preview URLs
  const hasAnyPreviewUrls = mapped.some((t) => t.url);

  return (
    <section>
      <div className="mb-4">
        <h2 className="mb-3 h-md">Tracklist</h2>
        
        {/* Spotify Player - only show if there are preview URLs */}
        {hasAnyPreviewUrls && <SpotifyPlayer trackUrl={currentTrackUrl} />}
      </div>

      <ol className="overflow-hidden border border-gray-800 divide-y divide-gray-700 rounded-lg">
        {mapped.map((t, i) => {
          const isCurrent = currentTrackUrl === t.url;
          const hasUrl = !!t.url;
          
          return (
            <li 
              key={t.id} 
              onClick={() => hasUrl && setCurrentTrackUrl(t.url)}
              className={`
                group relative flex items-center justify-between gap-4 px-4 py-3 
                transition-all duration-200
                ${hasUrl ? 'cursor-pointer' : 'cursor-default'}
                ${isCurrent 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-l-4 border-white shadow-lg' 
                  : hasUrl
                    ? 'bg-black hover:bg-gradient-to-r hover:from-gray-900 hover:to-black hover:border-l-2 hover:border-gray-500 hover:shadow-md'
                    : 'bg-black opacity-50'
                }
              `}
            >
              <div className="flex items-center flex-1 min-w-0 gap-4">
                <div className={`
                  flex-shrink-0 w-6 text-xs font-mono text-center
                  transition-colors duration-200
                  ${isCurrent ? 'text-white font-bold' : hasUrl ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-600'}
                `}>
                  {i + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`
                    mb-1 text-sm font-medium truncate
                    transition-colors duration-200
                    ${isCurrent ? 'text-white' : hasUrl ? 'text-gray-200 group-hover:text-white' : 'text-gray-400'}
                  `}>
                    {t.title}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className={`
                      truncate transition-colors duration-200
                      ${isCurrent ? 'text-gray-300' : hasUrl ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500'}
                    `}>
                      {t.artists.length > 0 ? (
                        t.artists.map((artist, idx) => (
                          <React.Fragment key={artist.slug}>
                            {idx > 0 && ", "}
                            <Link
                              href={`/artists/${artist.slug}`}
                              className={`transition-colors ${hasUrl ? 'hover:text-white underline decoration-transparent hover:decoration-white' : ''}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {artist.name}
                            </Link>
                          </React.Fragment>
                        ))
                      ) : (
                        <span>{t.artist}</span>
                      )}
                    </div>
                    
                    {t.remix_artists && t.remix_artists.length > 0 && (
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-gray-600">·</span>
                        <span>
                          {t.remix_artists.map((artist, idx) => (
                            <React.Fragment key={artist.slug}>
                              {idx > 0 && ", "}
                              <Link
                                href={`/artists/${artist.slug}`}
                                className={`transition-colors ${hasUrl ? 'hover:text-white underline decoration-transparent hover:decoration-white' : ''}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {artist.name}
                              </Link>
                            </React.Fragment>
                          ))} remix
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-shrink-0 gap-3">
                {t.bpm && (
                  <div className={`
                    hidden text-xs sm:block
                    transition-colors duration-200
                    ${isCurrent ? 'text-gray-400' : hasUrl ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600'}
                  `}>
                    {t.bpm} BPM
                  </div>
                )}
                {t.key && (
                  <div className={`
                    hidden text-xs md:block
                    transition-colors duration-200
                    ${isCurrent ? 'text-gray-400' : hasUrl ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600'}
                  `}>
                    {t.key}
                  </div>
                )}
                <div className={`
                  text-xs font-mono w-11 text-right
                  transition-colors duration-200
                  ${isCurrent ? 'text-gray-300' : hasUrl ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600'}
                `}>
                  {formatDuration(tracks[i]?.duration_seconds)}
                </div>
                {isCurrent && hasUrl && (
                  <div className="flex items-center justify-center w-5 h-5 animate-pulse">
                    <svg className="w-4 h-4 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
                {!isCurrent && hasUrl && (
                  <div className="flex items-center justify-center w-5 h-5 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
                {!hasUrl && (
                  <div className="w-5 h-5"></div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
