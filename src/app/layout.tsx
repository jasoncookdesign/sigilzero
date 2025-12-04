// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        <header className="border-b border-gray-800 bg-black">
          <div className="container-sigil py-6">
            <h1 className="text-center text-2xl font-bold tracking-widest text-white">
              SIGIL.ZERO
            </h1>
          </div>
        </header>

        <main className="container-sigil py-12 min-h-screen">
          {children}
        </main>

        <footer className="border-t border-gray-800 bg-black">
          <div className="container-sigil py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SIGIL.ZERO
          </div>
        </footer>
      </body>
    </html>
  );
}
