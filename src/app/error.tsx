'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Section from '../components/Section';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Runtime error:', error);
    }
  }, [error]);

  return (
    <Section>
      <div className="px-4 container-sigil sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center max-w-2xl py-12 mx-auto text-center">
          <h1 className="mb-4 text-6xl font-bold">500</h1>
          <h2 className="mb-6 text-2xl text-gray-400">Signal interference</h2>
          <p className="mb-8 text-gray-500">
            Something disrupted this channel. Try reinitializing the signal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={reset}
              className="btn btn-primary"
            >
              Retry
            </button>
            <Link
              href="/"
              className="btn btn-secondary"
            >
              Return to SIGIL.ZERO
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
