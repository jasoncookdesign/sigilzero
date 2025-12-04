"use client";

import { Card } from "../ui/Card";
import type { MixtapeDocument } from "../../lib/content/load-mixtapes";
import type { ArtistDocument } from "../../lib/content/load-artists";

type Props = {
  mixtape: MixtapeDocument["meta"];
  artist?: ArtistDocument["meta"] | null;
};

export default function MixtapeCard({ mixtape, artist }: Props) {
  return (
    <Card href={`/mixtapes/${mixtape.slug}`}>
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
    </Card>
  );
}
