// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Della_Respira, Mulish, Space_Mono } from "next/font/google";
import "./globals.css";
import AudioProvider from "../components/audio/AudioProvider";
import AudioPlayer from "../components/audio/AudioPlayer";
import Navigation from "../components/Navigation";
import PageNavigation from "../components/PageNavigation";
import { hasActiveSeries } from "../lib/content/load-series";
import { gtmLoaderScript } from "../lib/analytics/gtm";

// Heading font: Cormorant Garamond (weights: 500, 600, 700)
const della = Della_Respira({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
  display: "swap",
});

// Body font: Inter (weights: 400, 500, 600)
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

// Monospace font: Space Mono (weights: 400, 700)
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIGIL.ZERO",
  description: "Dance music imprint for buy-on-sight rave tracks on the darker side.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const GTM_CONTAINER_ID = "GTM-TLP35C5T";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showSeries = hasActiveSeries();

  return (
    <html lang="en" className={`${della.variable} ${mulish.variable} ${spaceMono.variable}`}>
      <head>
        <Script id="gtm-init" strategy="beforeInteractive">
          {gtmLoaderScript(GTM_CONTAINER_ID)}
        </Script>
      </head>
      <body data-page-type="unknown" data-release-title="" data-release-catalog-id="" data-artist-name="">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            className="hidden invisible"
            title="Google Tag Manager"
          />
        </noscript>
        <AudioProvider>
          <Navigation showSeries={showSeries} />
          <PageNavigation />

          <main>{children}</main>

          <AudioPlayer />

          <footer className="mt-16 border-t border-gray-800 bg-sigil-grey-950">
            <div className="py-12 container-sigil">
              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
                {/* About Column */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">
                    <Link href="/" className="transition-colors hover:text-white">
                      SIGIL.ZERO
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-400">
                    Dance music imprint for buy-on-sight rave tracks on the darker side.
                  </p>
                </div>

                {/* Links Column */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Explore</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/releases" className="text-gray-400 hover:text-white">
                        Releases
                      </Link>
                    </li>
                    <li>
                      <Link href="/artists" className="text-gray-400 hover:text-white">
                        Artists
                      </Link>
                    </li>
                    <li>
                      <Link href="/mixtapes" className="text-gray-400 hover:text-white">
                        Mixtapes
                      </Link>
                    </li>
                    {showSeries && (
                      <li>
                        <Link href="/series" className="text-gray-400 hover:text-white">
                          Series
                        </Link>
                      </li>
                    )}
                    <li>
                      <a href="/about" className="text-gray-400 hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="/press-kit"
                        className="text-gray-400 hover:text-white"
                        data-track="true"
                        data-entity="press"
                        data-action="click"
                        data-target="press_kit"
                        data-cta-type="press"
                      >
                        Press Kit
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact Column */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Connect</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://instagram.com/SIGIL.ZERO.RECORDS" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                        data-track="true"
                        data-entity="social"
                        data-action="click"
                        data-target="social_link"
                        data-platform="instagram"
                        data-section="footer"
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://soundcloud.com/sigil-zero" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                        data-track="true"
                        data-entity="social"
                        data-action="click"
                        data-target="social_link"
                        data-platform="soundcloud"
                        data-section="footer"
                      >
                        SoundCloud
                      </a>
                    </li>
                    <li>
                      <a 
                        href="mailto:info@sigilzero.com"
                        className="text-gray-400 hover:text-white"
                      >
                        General Inquiries
                      </a>
                    </li>
                    <li>
                      <a 
                        href="mailto:demos@sigilzero.com"
                        className="text-gray-400 hover:text-white"
                      >
                        Submit Demos
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 text-sm text-center text-gray-500 border-t border-gray-800">
                <p>© {new Date().getFullYear()} SIGIL.ZERO. Austin, TX. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AudioProvider>
        <script src="/assets/js/tracking.js" defer></script>
      </body>
    </html>
  );
}
