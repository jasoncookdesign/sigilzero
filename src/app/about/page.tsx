// src/app/about/page.tsx

import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-0">
      <Section className="text-center">
        <div className="container-sigil px-4 sm:px-6 lg:px-8">
          <h1 className="h-display mb-6 text-white uppercase">About SIGIL.ZERO</h1>
        </div>
      </Section>

      <Section>
        <div className="container-sigil px-4 sm:px-6 lg:px-8">
          <p className="leading-relaxed text-sm mb-4">
            SIGIL.ZERO is an occult-tinged electronic music imprint focused on
            high–impact, buy-on-sight releases. The catalog leans into dark,
            hypnotic, and industrial edges of techno and adjacent sounds, with a
            curation ethos built around quality control, longevity, and DJ
            usability.
          </p>

          <p className="leading-relaxed text-sm mb-4">
            In the first phase of the label, the focus is on building a tight
            catalog of weapon-grade tracks and establishing a clear sonic and visual
            identity. Over time, SIGIL.ZERO will grow into a trusted mark for
            promoters, DJs, and listeners—something you can drop or stream on sight
            and know it will land.
          </p>

          <p className="leading-relaxed text-sm">
            The label is based in Austin, TX, and run as a tightly curated project
            with close collaboration between artists, designers, and DJs who live
            inside the culture they're soundtracking.
          </p>
        </div>
      </Section>
    </div>
  );
}
