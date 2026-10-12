"use client";

import { Card } from "../ui/Card";
import type { ArtistDocument } from "../../lib/content/load-artists";
import PlaceholderImage from "../PlaceholderImage";

type Props = {
  artist: ArtistDocument["meta"];
};

export default function ArtistCard({ artist }: Props) {
  return (
    <Card
      href={`/artists/${artist.slug}`}
      data-testid="artist-card"
      trackingAttrs={{
        "data-track": "true",
        "data-entity": "artist",
        "data-action": "click",
        "data-target": "artist_link",
        "data-artist-name": artist.name,
        "data-section": "artists_grid",
      }}
    >
      <div>
        <div className="relative w-full overflow-hidden border-b border-gray-900 aspect-square bg-sigil-grey-900">
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

        <div className="p-3 sm:p-4">
          <h3 className="mb-2 h-sm">
            {artist.name}
          </h3>

          {artist.location && (
            <div className="mb-2 text-sm text-muted">
              {artist.location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
