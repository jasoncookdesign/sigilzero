// src/app/releases/page.tsx

import { loadAllReleases } from "../../lib/content/load-releases";
import { loadSeriesRegistry } from "../../lib/content/load-series-registry";
import { loadAllArtists } from "../../lib/content/load-artists";
import ReleasesCatalog from "./ReleasesCatalog";

export default function ReleasesPage() {
  const releases = loadAllReleases();
  const seriesRegistry = loadSeriesRegistry();
  const artists = loadAllArtists();

  return (
    <ReleasesCatalog
      releases={releases}
      seriesRegistry={seriesRegistry}
      artists={artists}
    />
  );
}
