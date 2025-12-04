import React from "react";

export default function LogoGrid() {
  const logos = [
    { href: "/assets/press/logo.svg", name: "SIGIL.ZERO (SVG)" },
    { href: "/assets/press/logo-inverted.svg", name: "SIGIL.ZERO (SVG, inverted)" },
    { href: "/assets/press/logo-mark.svg", name: "SIGIL.ZERO Mark (SVG)" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {logos.map((l) => (
        <div key={l.href} className="bg-gray-900 p-4 rounded border border-gray-800 flex flex-col items-center gap-3">
          <div className="w-full h-24 flex items-center justify-center">
            <img src={l.href} alt={l.name} className="max-h-20" />
          </div>
          <a href={l.href} download className="text-sm underline">
            Download {l.name}
          </a>
        </div>
      ))}
    </div>
  );
}
