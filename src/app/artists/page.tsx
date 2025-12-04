import { loadAllArtists } from "../../lib/content/load-artists";
import ArtistsGrid from "./ArtistsGrid";

export default function ArtistsPage() {
  const artists = loadAllArtists();

  return (
    <div>
      <h2 className="text-4xl mb-6 text-center">
        Artists
      </h2>

      <ArtistsGrid artists={artists} />
    </div>
  );
}
