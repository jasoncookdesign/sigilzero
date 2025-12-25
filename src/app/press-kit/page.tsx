import React from "react";
import Image from "next/image";

import { loadAllArtists } from "../../lib/content/load-artists";
import { loadAllReleases } from "../../lib/content/load-releases";
import { loadLabelMeta } from "../../lib/content/load-label";
import LogoGrid from "../../components/press/LogoGrid";
import ArtistAssetCard from "../../components/press/ArtistAssetCard";
import FeaturedReleaseCard from "../../components/press/FeaturedReleaseCard";
import Section from "../../components/Section";

export const metadata = {
  title: "Press Kit - SIGIL.ZERO",
};

export default function PressKitPage() {
  const artists = loadAllArtists().map((d) => d.meta);
  const label = loadLabelMeta();
  const allReleases = loadAllReleases().filter((r) => r.meta.active);
  const releases = allReleases.map((d) => d.meta).slice(0, 6);
  const flagship = allReleases.find((r) => r.meta.flagship) ?? allReleases[0];

  return (
    <div className="flex flex-col gap-0">
      <Section className="text-center">
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
       <h1 className="mb-6 text-center text-white h-display" data-testid="presskit-page-title">Press Kit</h1>
           <p className="max-w-lg mx-auto text-sm opacity-80">A minimal, cyber-arcane imprint for system-ready dance music. Use the assets below for editorial and promotional purposes.</p>
        </div>
      </Section>

      <Section>
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
          <h2 className="mb-4 h-md">Label Description</h2>
          <p className="mb-2">SIGIL.ZERO crafts dark, functional dance music with a focus on immersive, high-impact releases tailored for sound-system environments.</p>
          <p className="text-sm opacity-80">Short: System-ready rave weapons from the darker side. Long: SIGIL.ZERO is dedicated to curating heavyweight dancefloor soundscapes — releasing limited-run records, championing DJs and live artists whose music commands physical spaces and transforms clubs into rituals.</p>
        </div>
      </Section>

      <Section>
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
          <h2 className="mb-4 h-md">Key Links</h2>
          <p className="mb-4 text-sm opacity-80">Quick links for the label's social and streaming profiles.</p>
          <ul className="p-0 m-0 mb-4 text-sm leading-relaxed list-none">
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

        <h3 className="mb-2 h-sm">Logos</h3>
        <p className="mb-4 text-sm opacity-80">Download high-res and SVG logos for editorial use.</p>
        <LogoGrid />
        </div>
      </Section>

      {/* TODO: Complete Artist Assets section - need high-res headshots, bios, and downloadable media kits before enabling */}
      {false && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <h2 className="mb-4 h-md">Artist Assets</h2>
            <p className="mb-4 text-sm opacity-80">Headshots, short bios, socials and downloadable media kits for roster artists.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((a) => (
                <ArtistAssetCard key={a.id} artist={a} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* TODO: Complete Featured Releases section - need release descriptions and streaming links before enabling */}
      {false && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <h2 className="mb-4 h-md">Featured Releases</h2>
            <p className="mb-4 text-sm opacity-80">Selected releases with cover art, streaming links and short blurbs.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {releases.map((r) => (
                <FeaturedReleaseCard key={r.id} release={r} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* TODO: Populate Flagship Release section before enabling */}
      {false && (
        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <h2 className="mb-4 h-md">Flagship Release</h2>

            <p className="mb-2">Highlight release from the catalog:</p>

            {flagship && (
              <div className="p-3 text-sm border border-gray-800 rounded-lg bg-gray-950">
                <div className="mb-1 text-xs opacity-70">{flagship?.meta.catalog_number}</div>
                <div className="mb-1">{flagship?.meta.title}</div>
                <div className="mb-2 text-xs opacity-75">{flagship?.meta.release_date}</div>
                <a href={`/releases/${flagship?.meta.slug}`} className="text-sm underline">View release →</a>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section>
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
          <h2 className="mb-4 h-md">Contact</h2>
          <p className="text-sm">Press: <a href="mailto:press@sigilzero.com" className="underline">press@sigilzero.com</a></p>
          <p className="mt-2 text-sm">Instagram: <a href="https://instagram.com/SIGIL.ZERO.RECORDS" target="_blank" rel="noopener noreferrer" className="underline">@SIGIL.ZERO.RECORDS</a></p>
        </div>
      </Section>
    </div>
  );
}

