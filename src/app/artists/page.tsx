import { loadAllArtists } from "../../lib/content/load-artists";
import ArtistsGrid from "./ArtistsGrid";

export default function ArtistsPage() {
  const artists = loadAllArtists();

  return (
    <div>
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Artists
      </h2>

      <ArtistsGrid artists={artists} />
    </div>
  );
}
