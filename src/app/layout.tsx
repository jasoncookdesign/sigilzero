// src/app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import AudioProvider from "../components/audio/AudioProvider";
import AudioPlayer from "../components/audio/AudioPlayer";
import Navigation from "../components/Navigation";

// Heading font: Cormorant Garamond (weights: 500, 600, 700)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// Body font: Inter (weights: 400, 500, 600)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  description: "Dance music imprint for buy-on-sight rave weapons on the darker side.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <AudioProvider>
          <Navigation />

          <main className="min-h-screen">{children}</main>

          <AudioPlayer />

          <footer className="border-t border-gray-800 bg-gray-950 mt-16">
            <div className="container-sigil py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* About Column */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">SIGIL.ZERO</h3>
                  <p className="text-sm text-gray-400">
                    Dance music imprint for buy-on-sight rave weapons on the darker side.
                  </p>
                </div>

                {/* Links Column */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Explore</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/releases" className="text-gray-400 hover:text-white">
                        Releases
                      </a>
                    </li>
                    <li>
                      <a href="/artists" className="text-gray-400 hover:text-white">
                        Artists
                      </a>
                    </li>
                    <li>
                      <a href="/mixtapes" className="text-gray-400 hover:text-white">
                        Mixtapes
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="text-gray-400 hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="/press-kit" className="text-gray-400 hover:text-white">
                        Press Kit
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact Column */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://instagram.com/SIGIL.ZERO.RECORDS" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
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
              <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} SIGIL.ZERO. Austin, TX. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AudioProvider>
      </body>
    </html>
  );
}
