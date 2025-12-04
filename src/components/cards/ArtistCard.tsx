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
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "100%",
            overflow: "hidden",
            borderBottom: "1px solid #111",
          }}
        >
          {artist.photo ? (
            <Image
              src={artist.photo}
              alt={artist.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                opacity: 0.6,
              }}
            >
              No photo
            </div>
          )}
        </div>

        <div style={{ padding: "0.75rem 0.9rem 1rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              margin: 0,
              marginBottom: "0.35rem",
            }}
          >
            {artist.name}
          </h3>

          <div
            style={{
              fontSize: "0.85rem",
              opacity: 0.8,
              marginBottom: "0.25rem",
            }}
          >
            {artist.roles.join(" / ")}
          </div>

          {artist.location && (
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.7,
              }}
            >
              {artist.location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
