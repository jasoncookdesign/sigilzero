"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show back button on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
      aria-label="Go back"
    >
      <svg
        className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 19l-7-7 7-7"
        />
      </svg>
      <span>Back</span>
    </button>
  );
}
