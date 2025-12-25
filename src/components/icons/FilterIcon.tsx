import React from "react";

type Props = {
  className?: string;
};

export default function FilterIcon({ className = "w-5 h-5" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M4 5.5c0-.83.67-1.5 1.5-1.5h13c.83 0 1.5.67 1.5 1.5v1.4c0 .43-.17.85-.47 1.16l-6.6 7.01c-.25.27-.38.62-.38.99v3.04c0 .63-.6 1.07-1.19.88l-2.62-.86c-.38-.13-.64-.49-.64-.9v-2.15c0-.35-.13-.69-.37-.95L4.47 8.06A1.64 1.64 0 0 1 4 6.9V5.5Z" />
    </svg>
  );
}
