// src/app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import AudioProvider from "../components/audio/AudioProvider";
import AudioPlayer from "../components/audio/AudioPlayer";

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
          <header className="border-b border-gray-800 bg-black">
          <div className="container-sigil py-6">
            <h1 className="text-center text-2xl font-bold tracking-widest text-white">
              SIGIL.ZERO
            </h1>
          </div>
        </header>

          <main className="min-h-screen">{children}</main>

          <AudioPlayer />

          <footer className="border-t border-gray-800 bg-black">
            <div className="container-sigil py-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} SIGIL.ZERO
            </div>
          </footer>
        </AudioProvider>
      </body>
    </html>
  );
}
