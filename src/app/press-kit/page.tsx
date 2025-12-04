import React from "react";
import Image from "next/image";

import { loadAllArtists } from "../../lib/content/load-artists";
import { loadAllReleases } from "../../lib/content/load-releases";
import { loadLabelMeta } from "../../lib/content/load-label";
import LogoGrid from "../../components/press/LogoGrid";
import ArtistAssetCard from "../../components/press/ArtistAssetCard";
import FeaturedReleaseCard from "../../components/press/FeaturedReleaseCard";

export const metadata = {
  title: "Press Kit - SIGIL.ZERO",
};

export default function PressKitPage() {
  const artists = loadAllArtists().map((d) => d.meta);
  const label = loadLabelMeta();
  const allReleases = loadAllReleases();
  const releases = allReleases.map((d) => d.meta).slice(0, 6);
  const flagship = allReleases.find((r) => r.meta.flagship) ?? allReleases[0];

  return (
    <div className="prose prose-invert max-w-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">SIGIL.ZERO — Press Kit</h1>
        <p className="text-sm opacity-80 mt-2">A minimal, cyber-occult imprint for system-ready dance music. Use the assets below for editorial and promotional purposes.</p>
      </header>

      <section className="mb-10">
        <h2 className="h-md mb-4">1. Label Description</h2>
        <p className="mb-2">SIGIL.ZERO crafts dark, functional dance music with a focus on immersive, high-impact releases tailored for sound-system environments.</p>
        <p className="text-sm opacity-80">Short: System-ready rave weapons from the darker side. Long: SIGIL.ZERO is dedicated to curating heavyweight dancefloor soundscapes — releasing limited-run records, championing DJs and live artists whose music commands physical spaces and transforms clubs into rituals.</p>
      </section>

      <section className="mb-10">
        <h2 className="h-md mb-4">2. Key Links</h2>
        <p className="text-sm opacity-80 mb-4">Quick links for the label's social and streaming profiles.</p>
        <ul className="list-none p-0 m-0 text-sm leading-relaxed mb-4">
          {label.social?.instagram && (
            <li>
              Instagram: {" "}
              <a href={label.social.instagram} target="_blank" rel="noopener noreferrer" className="underline">
                {label.social.instagram}
              </a>
            </li>
          )}
          {label.social?.soundcloud && (
            <li>
              SoundCloud: {" "}
              <a href={label.social.soundcloud} target="_blank" rel="noopener noreferrer" className="underline">
                {label.social.soundcloud}
              </a>
            </li>
          )}
          {label.social?.spotify && (
            <li>
              Spotify: {" "}
              <a href={label.social.spotify} target="_blank" rel="noopener noreferrer" className="underline">
                {label.social.spotify}
              </a>
            </li>
          )}
        </ul>

        <h3 className="h-sm mb-2">Logos</h3>
        <p className="text-sm opacity-80 mb-4">Download high-res and SVG logos for editorial use.</p>
        <LogoGrid />
      </section>

      <section className="mb-10">
        <h2 className="h-md mb-4">3. Artist Assets</h2>
        <p className="text-sm opacity-80 mb-4">Headshots, short bios, socials and downloadable media kits for roster artists.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((a) => (
            <ArtistAssetCard key={a.id} artist={a} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="h-md mb-4">4. Featured Releases</h2>
        <p className="text-sm opacity-80 mb-4">Selected releases with cover art, streaming links and short blurbs.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {releases.map((r) => (
            <FeaturedReleaseCard key={r.id} release={r} />
          ))}
        </div>
      </section>

      {flagship && (
        <section className="mb-10">
          <h2 className="h-md mb-4">Flagship Release</h2>

          <p className="mb-2">Highlight release from the catalog:</p>

          <div className="border border-gray-800 rounded-lg p-3 bg-gray-950 text-sm">
            <div className="text-xs opacity-70 mb-1">{flagship.meta.catalog_number}</div>
            <div className="mb-1">{flagship.meta.title}</div>
            <div className="text-xs opacity-75 mb-2">{flagship.meta.release_date}</div>
            <a href={`/releases/${flagship.meta.slug}`} className="text-sm underline">View release →</a>
          </div>
        </section>
      )}

      <section className="mb-16">
        <h2 className="h-md mb-4">5. Contact</h2>
        <p className="text-sm">Press: <a href="mailto:press@sigilzero.com" className="underline">press@sigilzero.com</a></p>
        <p className="text-sm mt-2">Socials: <a href="https://instagram.com/sigil.zero" target="_blank" rel="noopener noreferrer" className="underline">@sigil.zero</a> · <a href="https://twitter.com/sigilzero" target="_blank" rel="noopener noreferrer" className="underline">@sigilzero</a></p>
      </section>
    </div>
  );
}

