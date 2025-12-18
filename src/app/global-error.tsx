'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Global runtime error:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased text-white bg-black">
        <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center max-w-2xl py-12 mx-auto text-center">
            <h1 className="mb-4 text-6xl font-bold">500</h1>
            <h2 className="mb-6 text-2xl text-gray-400">Signal interference</h2>
            <p className="mb-8 text-gray-500">
              Something disrupted this channel. Try reinitializing the signal.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="px-6 py-3 text-sm font-medium text-white transition-colors bg-gray-900 border border-gray-700 rounded hover:bg-gray-800"
              >
                Retry
              </button>
              <Link
                href="/"
                className="px-6 py-3 text-sm font-medium text-white transition-colors bg-gray-900 border border-gray-700 rounded hover:bg-gray-800"
              >
                Return to SIGIL.ZERO
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
