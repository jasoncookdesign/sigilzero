import React from "react";
import type { Artist } from "../../lib/schemas/artist";
import PlaceholderImage from "../PlaceholderImage";

export default function ArtistAssetCard({ artist }: { artist: Artist }) {
  return (
    <div className="bg-gray-900 rounded border border-gray-800 overflow-hidden">
      <div className="relative w-full h-56 bg-gray-800">
        <PlaceholderImage
          src={artist.photo}
          alt={artist.name}
          width={400}
          height={400}
          fill
          placeholderText={artist.name}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{artist.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{artist.roles?.join(", ")}</p>
        <p className="text-sm mt-2 text-gray-300">{(artist.for_fans_of || []).slice(0, 3).join(", ")}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-3">
            {artist.social?.instagram && (
              <a href={artist.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs underline">IG</a>
            )}
            {artist.social?.soundcloud && (
              <a href={artist.social.soundcloud} target="_blank" rel="noopener noreferrer" className="text-xs underline">SC</a>
            )}
            {artist.social?.spotify && (
              <a href={artist.social.spotify} target="_blank" rel="noopener noreferrer" className="text-xs underline">Spotify</a>
            )}
          </div>

          <a href={`/assets/press/${artist.id}-media-kit.zip`} className="text-xs underline">Download kit</a>
        </div>
      </div>
    </div>
  );
}
