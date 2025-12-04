"use client";

import type { ArtistDocument } from "../../lib/content/load-artists";
import ArtistCard from "../../components/cards/ArtistCard";

type Props = {
  artists: ArtistDocument[];
};

export default function ArtistsGrid({ artists }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {artists.map(({ meta }) => (
        <ArtistCard key={meta.id} artist={meta} />
      ))}
    </div>
  );
}
