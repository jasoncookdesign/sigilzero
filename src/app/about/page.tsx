// src/app/about/page.tsx

import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <div className="min-h-[50vh]">
      <div className="flex flex-col gap-0">
        <Section className="text-center">
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
       <h1 className="mb-6 text-center text-white h-display" data-testid="about-page-title">About SIGIL.ZERO</h1>
        </div>
      </Section>

      <Section>
        <div className="px-4 container-sigil sm:px-6 lg:px-8">
          <p className="mb-4 text-sm leading-relaxed">
            SIGIL.ZERO is an occult-tinged electronic music imprint focused on
            high–impact, buy-on-sight releases. The catalog leans into dark,
            hypnotic, and industrial edges of techno and adjacent sounds, with a
            curation ethos built around quality control, longevity, and DJ
            usability.
          </p>

          <p className="mb-4 text-sm leading-relaxed">
            In the first phase of the label, the focus is on building a tight
            catalog of weapon-grade tracks and establishing a clear sonic and visual
            identity. Over time, SIGIL.ZERO will grow into a trusted mark for
            promoters, DJs, and listeners—something you can drop or stream on sight
            and know it will land.
          </p>

          <p className="text-sm leading-relaxed">
            The label is based in Austin, TX, and run as a tightly curated project
            with close collaboration between artists, designers, and DJs who live
            inside the culture they're soundtracking.
          </p>
        </div>
      </Section>
    </div>
    </div>
  );
}
