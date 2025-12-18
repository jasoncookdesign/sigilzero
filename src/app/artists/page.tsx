import { loadAllArtists } from "../../lib/content/load-artists";
import ArtistsGrid from "./ArtistsGrid";
import Section from "../../components/Section";

export default function ArtistsPage() {
  const artists = loadAllArtists();
  const activeArtists = artists.filter((a) => a.meta.active);

  return (
    <Section>
      <div className="container-sigil px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl mb-6 text-center">
          Artists
        </h2>

        <ArtistsGrid artists={activeArtists} />
      </div>
    </Section>
  );
}
