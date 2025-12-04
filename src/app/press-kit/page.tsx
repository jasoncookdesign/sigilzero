// src/app/press-kit/page.tsx

import Link from "next/link";
import { loadLabelMeta } from "../../lib/content/load-label";
import { loadAllReleases } from "../../lib/content/load-releases";

export default function PressKitPage() {
  const label = loadLabelMeta();
  const releases = loadAllReleases();

  const flagship = releases.find((r) => r.meta.flagship) ?? releases[0];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Press Kit</h1>

      {/* Label overview */}
      <section style={{ marginBottom: "1.75rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          Label Overview
        </h2>

        <p
          style={{
            lineHeight: 1.6,
            fontSize: "0.95rem",
            marginBottom: "0.75rem",
          }}
        >
          <strong>{label.name}</strong> is an electronic music label focused on
          dark, hypnotic, and high–energy club music. The catalog is curated for
          DJs and listeners who seek quality–controlled, system-ready tracks
          with a distinct aesthetic edge.
        </p>

        <p
          style={{
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          Based in {label.location ?? "Austin, TX"}, the label operates as a
          tightly curated imprint with a long-term view on catalog value and
          artist development rather than high-volume release cycles.
        </p>
      </section>

      {/* Key links */}
      <section style={{ marginBottom: "1.75rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          Key Links
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
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
        <section style={{ marginBottom: "1.75rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.5rem",
            }}
          >
            Flagship Release
          </h2>

          <p
            style={{
              lineHeight: 1.6,
              fontSize: "0.95rem",
              marginBottom: "0.5rem",
            }}
          >
            Highlight release from the catalog:
          </p>

          <div
            style={{
              border: "1px solid #222",
              borderRadius: "8px",
              padding: "0.75rem 0.9rem",
              background: "#050505",
              fontSize: "0.95rem",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.7,
                marginBottom: "0.2rem",
              }}
            >
              {flagship.meta.catalog_number}
            </div>
            <div
              style={{
                fontSize: "1rem",
                marginBottom: "0.15rem",
              }}
            >
              {flagship.meta.title}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.75,
                marginBottom: "0.4rem",
              }}
            >
              {flagship.meta.release_date}
            </div>
            <Link
              href={`/releases/${flagship.meta.slug}`}
              style={{
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              View release →
            </Link>
          </div>
        </section>
      )}

      {/* Contact */}
      <section>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          Contact
        </h2>

        <p
          style={{
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          For press inquiries, label info, or assets, contact:{" "}
          {label.contact_email ?? label.demo_email ?? "info@sigilzero.com"}
        </p>
      </section>
    </div>
  );
}
