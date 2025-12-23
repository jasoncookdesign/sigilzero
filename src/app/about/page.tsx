// src/app/about/page.tsx

import Section from "../../components/Section";

export default function AboutPage() {
  return (
    <div className="min-h-[50vh]">
      <div className="flex flex-col gap-0">
        <Section className="text-center">
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <h1
              className="mb-6 text-center text-white h-display"
              data-testid="about-page-title"
            >
              About SIGIL.ZERO
            </h1>
          </div>
        </Section>

        <Section>
          <div className="px-4 container-sigil sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="mb-4 text-sm leading-relaxed">
                SIGIL.ZERO is an arcane-tinged electronic music imprint built
                for producers, DJs, and listeners who care about impact, intent,
                and longevity. The label specializes in high-utility,
                buy-on-sight releases—records designed to work on real
                dancefloors, hold up over time, and earn trust through
                consistency rather than hype.
              </p>

              <p className="mb-4 text-sm leading-relaxed">
                Sonically, SIGIL.ZERO leans into the darker, hypnotic, and
                industrial edges of techno and adjacent underground forms.
                Releases prioritize DJ usability, physicality, and tension:
                tracks that cut through a system, lock a room, and reward repeat
                plays. If it doesn't function as a weapon, it doesn't ship.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column: The Ethos */}
              <div>
                <h2 className="mb-4 text-lg font-bold tracking-wide h-sm">
                  The Ethos (For Producers & Remixers)
                </h2>

                <p className="mb-4 text-sm leading-relaxed">
                  SIGIL.ZERO is tightly curated, not open-submission by default.
                  The label values:
                </p>

                <ul className="mb-4 space-y-2 text-sm leading-relaxed list-none">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>Strong musical identity over trend-chasing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>Functional dancefloor design over novelty</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>
                      Artists who understand club systems, pacing, and pressure
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>Long-term creative alignment over one-off placements</span>
                  </li>
                </ul>

                <p className="mb-4 text-sm leading-relaxed">
                  In its current phase, SIGIL.ZERO is focused on building a
                  small, uncompromising catalog and establishing a clear sonic
                  and visual language. That means fewer releases, higher
                  standards, and hands-on collaboration. Artists released on the
                  label are treated as contributors to a larger signal—not
                  content to be churned.
                </p>

                <p className="mb-4 text-sm leading-relaxed">
                  Demo submissions are not always open. When they are, submission
                  details will be published clearly and intentionally. Unsolicited
                  demos sent outside those windows are unlikely to be reviewed—not
                  out of arrogance, but out of respect for focus and curation.
                </p>

                <p className="mb-4 text-sm font-semibold leading-relaxed">
                  If you're a producer or remixer considering SIGIL.ZERO, ask
                  yourself:
                </p>

                <ul className="space-y-2 text-sm leading-relaxed list-none">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>Would this track still hit in five years?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>Does it solve a problem for a DJ?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-red-500">•</span>
                    <span>Does it belong to a catalog, not just a playlist?</span>
                  </li>
                </ul>

                <p className="mt-4 text-sm leading-relaxed">
                  If the answer is yes, you're thinking in the right language.
                </p>
              </div>

              {/* Right Column: For DJs, Promoters, and Listeners */}
              <div>
                <h2 className="mb-4 text-lg font-bold tracking-wide h-sm">
                  For DJs, Promoters, and Listeners
                </h2>

                <p className="mb-4 text-sm leading-relaxed">
                  SIGIL.ZERO is designed to function as a trust mark. When you
                  see the imprint, you should know what you're getting:
                  disciplined sound design, deliberate aesthetics, and records
                  made by people who live inside the culture they're
                  soundtracking.
                </p>

                <p className="mb-4 text-sm leading-relaxed">
                  The label is based in Austin, TX, but its orientation is
                  global and underground—built by DJs, producers, and designers
                  who value systems, rooms, and ritual over reach metrics.
                </p>

                <p className="mb-4 text-sm font-semibold text-white">
                  This is not a volume play.
                </p>

                <p className="mb-4 text-sm font-semibold text-white">
                  This is not a vibe-of-the-week label.
                </p>

                <p className="mb-6 text-sm leading-relaxed">
                  SIGIL.ZERO exists to publish records that hold, travel, and
                  work—now and later.
                </p>

                <p className="text-sm leading-relaxed">
                  Watch this space for release drops, artist collaborations, and
                  future submission windows.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
