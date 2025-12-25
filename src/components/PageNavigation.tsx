"use client";

import BackButton from "./BackButton";
import Breadcrumb from "./Breadcrumb";
import { usePathname } from "next/navigation";

export default function PageNavigation() {
  const pathname = usePathname();

  // Don't show on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 container-sigil mt-6 mb-8">
      <div className="flex items-center gap-6">
        <BackButton />
        <Breadcrumb />
      </div>
    </div>
  );
}
