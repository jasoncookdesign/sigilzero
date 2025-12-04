// src/app/press-kit/page.tsx

import Link from "next/link";
import { loadLabelMeta } from "../../lib/content/load-label";
import { loadAllReleases } from "../../lib/content/load-releases";

export default function PressKitPage() {
  const label = loadLabelMeta();
  const releases = loadAllReleases();

  const flagship = releases.find((r) => r.meta.flagship) ?? releases[0];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl mb-4">Press Kit</h1>

      {/* Label overview */}
      <section className="mb-7">
        <h2 className="h-md mb-2">
          Label Overview
        </h2>

        <p className="leading-relaxed text-sm mb-3">
          <strong>{label.name}</strong> is an electronic music label focused on
          dark, hypnotic, and high–energy club music. The catalog is curated for
          DJs and listeners who seek quality–controlled, system-ready tracks
          with a distinct aesthetic edge.
        </p>

        <p className="leading-relaxed text-sm">
          Based in {label.location ?? "Austin, TX"}, the label operates as a
          tightly curated imprint with a long-term view on catalog value and
          artist development rather than high-volume release cycles.
        </p>
      </section>

      {/* Key links */}
      <section className="mb-7">
        <h2 className="h-md mb-2">
          Key Links
        </h2>

        <ul className="list-none p-0 m-0 text-sm leading-relaxed">
          {label.social?.instagram && (
            <li>
              Instagram:{" "}
              <a
                href={label.social.instagram}
                target="_blank"
                rel="noreferrer"
              >
                {label.social.instagram}
              </a>
            </li>
          )}
          {label.social?.soundcloud && (
            <li>
              SoundCloud:{" "}
              <a
                href={label.social.soundcloud}
                target="_blank"
                rel="noreferrer"
              >
                {label.social.soundcloud}
              </a>
            </li>
          )}
          {label.social?.spotify && (
            <li>
              Spotify:{" "}
              <a
                href={label.social.spotify}
                target="_blank"
                rel="noreferrer"
              >
                {label.social.spotify}
              </a>
            </li>
          )}
        </ul>
      </section>

      {/* Flagship release */}
      {flagship && (
        <section className="mb-7">
          <h2 className="h-md mb-2">
            Flagship Release
          </h2>

          <p className="leading-relaxed text-sm mb-2">
            Highlight release from the catalog:
          </p>

          <div className="border border-gray-800 rounded-lg p-3 bg-gray-950 text-sm">
            <div className="text-xs opacity-70 mb-1">
              {flagship.meta.catalog_number}
            </div>
            <div className="mb-1">
              {flagship.meta.title}
            </div>
            <div className="text-xs opacity-75 mb-2">
              {flagship.meta.release_date}
            </div>
            <Link
              href={`/releases/${flagship.meta.slug}`}
              className="text-sm"
            >
              View release →
            </Link>
          </div>
        </section>
      )}

      {/* Contact */}
      <section>
        <h2 className="h-md mb-2">
          Contact
        </h2>

        <p className="leading-relaxed text-sm">
          For press inquiries, label info, or assets, contact:{" "}
          {label.contact_email ?? label.demo_email ?? "info@sigilzero.com"}
        </p>
      </section>
    </div>
  );
}
