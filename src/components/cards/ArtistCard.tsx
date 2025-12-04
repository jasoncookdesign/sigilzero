"use client";

import Image from "next/image";
import { Card } from "../ui/Card";
import type { ArtistDocument } from "../../lib/content/load-artists";

type Props = {
  artist: ArtistDocument["meta"];
};

export default function ArtistCard({ artist }: Props) {
  return (
    <Card href={`/artists/${artist.slug}`}>
      <div>
        <div className="relative w-full overflow-hidden border-b border-gray-900 pb-full bg-gray-900">
          {artist.photo ? (
            <Image
              src={artist.photo}
              alt={artist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-gray-600">No photo</span>
            </div>
          )}
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
