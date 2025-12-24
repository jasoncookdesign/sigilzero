"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  href?: string;
  children: ReactNode;
  "data-testid"?: string;
};

export function Card({ href, children, "data-testid": dataTestId }: CardProps) {
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
        data-testid={dataTestId}
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
