"use client";

import type { ArtistDocument } from "../../lib/content/load-artists";
import ArtistCard from "../../components/cards/ArtistCard";

type Props = {
  artists: ArtistDocument[];
};

export default function ArtistsGrid({ artists }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {artists.map(({ meta }) => (
        <ArtistCard key={meta.id} artist={meta} />
      ))}
    </div>
  );
}
