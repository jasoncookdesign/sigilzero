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
      <div style={{ padding: "1rem" }}>
        <h3 style={{ margin: "0 0 0.25rem 0" }}>{mixtape.title}</h3>

        <div
          style={{
            fontSize: "0.85rem",
            opacity: 0.75,
            marginBottom: "0.3rem",
          }}
        >
          {mixtape.date}
        </div>

        {artist && (
          <div
            style={{
              fontSize: "0.85rem",
              opacity: 0.8,
              marginBottom: "0.3rem",
            }}
          >
            {artist.name}
          </div>
        )}

        <div
          style={{
            fontSize: "0.8rem",
            opacity: 0.7,
          }}
        >
          {mixtape.platform}
          {mixtape.event_name && ` · ${mixtape.event_name}`}
          {mixtape.location && ` · ${mixtape.location}`}
        </div>
      </div>
    </Card>
  );
}
