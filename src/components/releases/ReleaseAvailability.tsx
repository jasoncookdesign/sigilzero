"use client";

import type { ComponentProps } from "react";
import StreamingLinks from "./StreamingLinks";
import { getReleaseStatus } from "../../lib/release-status";
import { useToday } from "../../lib/use-today";

/**
 * Release-page pieces whose state depends on today's date. They render from
 * the build day in static HTML and switch to the visitor's day after
 * hydration, so a release goes live on its date without a redeploy.
 */

export function ReleaseStatusText({ releaseDate }: { releaseDate: string }) {
  const status = getReleaseStatus(releaseDate, useToday());
  if (!status.type) return null;
  return (
    <>
      {" "}·{" "}
      <span className={status.type === "coming-soon" ? "text-gray-400" : "text-green-400"}>
        {status.label}
      </span>
    </>
  );
}

type ReleaseStreamingLinksProps = Omit<ComponentProps<typeof StreamingLinks>, "disabled"> & {
  releaseDate: string;
};

export function ReleaseStreamingLinks({ releaseDate, ...props }: ReleaseStreamingLinksProps) {
  const status = getReleaseStatus(releaseDate, useToday());
  return <StreamingLinks {...props} disabled={status.type === "coming-soon"} />;
}
