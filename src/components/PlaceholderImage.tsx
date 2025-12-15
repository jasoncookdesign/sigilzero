"use client";

import React, { useState } from "react";
import Image from "next/image";
import { buildPlaceholdUrl } from "../lib/placehold";

type PlaceholderImageProps = {
  src?: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  placeholderText?: string | undefined;
  className?: string | undefined;
  fill?: boolean | undefined;
  objectFit?: "cover" | "contain" | undefined;
};

/**
 * Wrapper around Next.js Image that falls back to placehold.co if src is missing/invalid.
 * Falls back to placeholder if src is undefined, null, or empty string.
 */
export default function PlaceholderImage({
  src,
  alt,
  width,
  height,
  placeholderText,
  className,
  fill,
  objectFit = "cover",
}: PlaceholderImageProps) {
  const [imgError, setImgError] = useState(false);

  // Use placeholder if src is missing or if image failed to load
  const usePlaceholder = !src || src.trim() === "" || imgError;

  const finalSrc = usePlaceholder
    ? buildPlaceholdUrl({
        width,
        height,
        format: "svg",
        background: "1a1a1a",
        color: "666666",
        text: placeholderText || `${width}x${height}`,
      })
    : src;

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        style={{ objectFit }}
        onError={() => !usePlaceholder && setImgError(true)}
        unoptimized={usePlaceholder}
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit }}
      onError={() => !usePlaceholder && setImgError(true)}
      unoptimized={usePlaceholder}
    />
  );
}
