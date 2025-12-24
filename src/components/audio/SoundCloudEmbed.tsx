"use client";

import React from "react";

type SoundCloudEmbedProps = {
  url: string;
  title?: string;
  visual?: boolean;
  autoPlay?: boolean;
  className?: string;
};

/**
 * Converts a SoundCloud track URL to an embed URL
 * @param url - The SoundCloud track URL (e.g., https://soundcloud.com/artist/track)
 * @param visual - Whether to show visual mode (with artwork) or compact mode
 * @returns The SoundCloud widget embed URL
 */
function buildSoundCloudEmbedUrl(url: string, visual: boolean = true, autoPlay: boolean = false): string {
  const params = new URLSearchParams({
    url: url,
    color: "ff5500",
    auto_play: autoPlay.toString(),
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: visual.toString(),
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

/**
 * SoundCloud embed player component
 * Renders a responsive iframe with SoundCloud's widget player
 */
export default function SoundCloudEmbed({
  url,
  title = "SoundCloud Player",
  visual = true,
  autoPlay = false,
  className = "",
}: SoundCloudEmbedProps) {
  const embedUrl = buildSoundCloudEmbedUrl(url, visual, autoPlay);
  const height = visual ? 400 : 166;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white rounded hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/>
          </svg>
          Open on SoundCloud
        </a>
      </div>
      <iframe
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        title={title}
        className="rounded-lg"
      />
    </div>
  );
}
