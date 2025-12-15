import React from "react";
import type { Release } from "../../lib/schemas/release";
import PlaceholderImage from "../PlaceholderImage";

export default function FeaturedReleaseCard({ release }: { release: Release }) {
  return (
    <div className="bg-gray-900 rounded border border-gray-800 overflow-hidden">
      <div className="relative w-full h-56 bg-gray-800">
        <PlaceholderImage
          src={release.cover_art}
          alt={release.title}
          width={400}
          height={400}
          fill
          placeholderText={release.catalog_number}
          className="object-cover"
        />
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
