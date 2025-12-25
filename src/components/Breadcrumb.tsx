"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on homepage
  if (pathname === "/") {
    return null;
  }

  // Build breadcrumb items from pathname
  const segments = pathname.split("/").filter(Boolean);
  
  const breadcrumbItems = segments.map((segment, index) => {
    // Decode URL segments
    const decodedSegment = decodeURIComponent(segment);
    
    // Build the href for this breadcrumb
    const href = "/" + segments.slice(0, index + 1).join("/");
    
    // Format label - capitalize and replace hyphens with spaces
    const label = decodedSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      label,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs text-gray-400">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-white"
          >
            Home
          </Link>
        </li>

        {/* Breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <span className="text-gray-600">/</span>
            {item.isLast ? (
              <span className="text-gray-300">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
