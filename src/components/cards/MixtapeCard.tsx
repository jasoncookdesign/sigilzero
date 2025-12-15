"use client";

import { Card } from "../ui/Card";
import type { MixtapeDocument } from "../../lib/content/load-mixtapes";
import type { ArtistDocument } from "../../lib/content/load-artists";
import PlaceholderImage from "../PlaceholderImage";

type Props = {
  mixtape: MixtapeDocument["meta"];
  artist?: ArtistDocument["meta"] | null;
};

export default function MixtapeCard({ mixtape, artist }: Props) {
  return (
    <Card href={`/mixtapes/${mixtape.slug}`}>
      <div>
        <div className="relative w-full h-48 overflow-hidden bg-gray-900">
          <PlaceholderImage
            src={mixtape.cover_image}
            alt={mixtape.title}
            width={400}
            height={300}
            fill
            placeholderText={mixtape.title}
            className="object-cover"
          />
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="h-sm mb-2">{
            mixtape.title
          }</h3>

          <div className="mb-2 text-sm text-muted">
            {mixtape.date}
          </div>

          {artist && (
            <div className="mb-2 text-sm text-muted">
              {artist.name}
            </div>
          )}

          <div className="text-xs text-gray-600">
            {mixtape.platform}
            {mixtape.event_name && ` · ${mixtape.event_name}`}
            {mixtape.location && ` · ${mixtape.location}`}
          </div>
        </div>
      </div>
    </Card>
  );
}
