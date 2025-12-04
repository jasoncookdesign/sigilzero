"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  href?: string;
  children: ReactNode;
};

export function Card({ href, children }: CardProps) {
  const inner = (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
        }}
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
