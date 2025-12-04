import React from "react";
import Image from "next/image";
import type { Release } from "../../lib/schemas/release";

export default function FeaturedReleaseCard({ release }: { release: Release }) {
  return (
    <div className="bg-gray-900 rounded border border-gray-800 overflow-hidden">
      <div className="relative w-full h-56 bg-gray-800">
        {release.cover_art ? (
          <Image src={release.cover_art} alt={release.title} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">No art</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{release.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{release.catalog_number}</p>
        <p className="text-sm mt-2 text-gray-300">{(release.genres || []).slice(0, 3).join(", ")}</p>
        <div className="mt-4 flex items-center justify-between">
          <a href={`/releases/${release.slug}`} className="text-xs underline">Details</a>
          <a href={release.link_groups?.streaming ?? "#"} target="_blank" rel="noopener noreferrer" className="text-xs underline">Stream</a>
        </div>
      </div>
    </div>
  );
}
