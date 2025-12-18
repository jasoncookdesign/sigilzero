// src/app/mixtapes/page.tsx

import { loadAllMixtapes } from "../../lib/content/load-mixtapes";
import { loadAllArtists } from "../../lib/content/load-artists";
import MixtapesCatalog from "./MixtapesCatalog";

export default function MixtapesPage() {
  const mixtapes = loadAllMixtapes();
  const artists = loadAllArtists();

  const activeMixtapes = mixtapes.filter((m) => m.meta.active);

  return <MixtapesCatalog mixtapes={activeMixtapes} artists={artists} />;
}
