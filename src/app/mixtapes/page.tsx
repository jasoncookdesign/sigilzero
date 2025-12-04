// src/app/mixtapes/page.tsx

import { loadAllMixtapes } from "../../lib/content/load-mixtapes";
import { loadAllArtists } from "../../lib/content/load-artists";
import MixtapesCatalog from "./MixtapesCatalog";

export default function MixtapesPage() {
  const mixtapes = loadAllMixtapes();
  const artists = loadAllArtists();

  return <MixtapesCatalog mixtapes={mixtapes} artists={artists} />;
}
