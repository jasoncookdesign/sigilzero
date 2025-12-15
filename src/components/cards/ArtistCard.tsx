"use client";

import { Card } from "../ui/Card";
import type { ArtistDocument } from "../../lib/content/load-artists";
import PlaceholderImage from "../PlaceholderImage";

type Props = {
  artist: ArtistDocument["meta"];
};

export default function ArtistCard({ artist }: Props) {
  return (
    <Card href={`/artists/${artist.slug}`}>
      <div>
        <div className="relative w-full h-48 overflow-hidden border-b border-gray-900 bg-gray-900">
          <PlaceholderImage
            src={artist.photo}
            alt={artist.name}
            width={400}
            height={300}
            fill
            placeholderText={artist.name}
            className="object-cover"
          />
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="h-sm mb-2">
            {artist.name}
          </h3>

          <div className="mb-2 text-sm text-muted">
            {artist.roles.join(" / ")}
          </div>

          {artist.location && (
            <div className="text-xs text-gray-600">
              {artist.location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
