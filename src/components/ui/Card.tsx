"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  href?: string;
  children: ReactNode;
};

export function Card({ href, children }: CardProps) {
  const inner = (
    <div className="card">
      {children}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block text-inherit no-underline"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
