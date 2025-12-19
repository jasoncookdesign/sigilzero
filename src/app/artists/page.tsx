import { loadAllArtists } from "../../lib/content/load-artists";
import ArtistsGrid from "./ArtistsGrid";
import Section from "../../components/Section";

export default function ArtistsPage() {
  const artists = loadAllArtists();
  const activeArtists = artists.filter((a) => a.meta.active);

  return (
    <Section>
      <div className="px-4 container-sigil sm:px-6 lg:px-8">
        <h1 className="mb-6 text-center text-white h-display" data-testid="artists-page-title">Artists</h1>
 
        <ArtistsGrid artists={activeArtists} />
      </div>
    </Section>
  );
}
