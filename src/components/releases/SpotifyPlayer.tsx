"use client";

import { useEffect, useRef } from "react";

type SpotifyPlayerProps = {
  trackUrl: string | null;
};

export default function SpotifyPlayer({ trackUrl }: SpotifyPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Update iframe src when trackUrl changes
    if (iframeRef.current && trackUrl) {
      const trackId = extractTrackId(trackUrl);
      if (trackId) {
        iframeRef.current.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
      }
    }
  }, [trackUrl]);

  if (!trackUrl) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-900 rounded-lg">
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="#4B5563"/>
        </svg>
      </div>
    );
  }

  const trackId = extractTrackId(trackUrl);

  if (!trackId) {
    return (
      <div className="flex items-center justify-center h-20 text-sm text-gray-400 bg-gray-900 rounded-lg">
        Invalid Spotify URL
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <iframe
        ref={iframeRef}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
      />
    </div>
  );
}

function extractTrackId(url: string): string | null {
  try {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
