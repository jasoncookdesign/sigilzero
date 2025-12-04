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
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <header
          style={{
            padding: "1rem",
            borderBottom: "1px solid #333",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "0.05em" }}>
            SIGIL.ZERO
          </h1>
        </header>

        <main style={{ padding: "2rem", minHeight: "70vh" }}>{children}</main>

        <footer
          style={{
            padding: "1rem",
            borderTop: "1px solid #333",
            textAlign: "center",
            opacity: 0.6,
            fontSize: "0.9rem",
          }}
        >
          © {new Date().getFullYear()} SIGIL.ZERO
        </footer>
      </body>
    </html>
  );
}
