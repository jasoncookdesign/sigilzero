import Link from "next/link";
import Section from "../components/Section";

export default function NotFound() {
  return (
    <Section>
      <div className="px-4 container-sigil sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center max-w-2xl py-12 mx-auto text-center">
          <h1 className="mb-4 text-6xl font-bold">404</h1>
          <h2 className="mb-6 text-2xl text-gray-400">No signal detected</h2>
          <p className="mb-8 text-gray-500">
            The page you're looking for either never existed, or has phased out of this reality.
          </p>
          <Link
            href="/"
            className="btn btn-primary"
          >
            Go home to rebind the sigil
          </Link>
        </div>
      </div>
    </Section>
  );
}
