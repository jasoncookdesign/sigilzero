// src/app/releases/page.tsx

import { loadAllReleases } from "../../lib/content/load-releases";
import { loadSeriesRegistry } from "../../lib/content/load-series-registry";
import { loadAllArtists } from "../../lib/content/load-artists";
import { hasActiveSeries } from "../../lib/content/load-series";
import ReleasesCatalog from "./ReleasesCatalog";

export default function ReleasesPage() {
  const releases = loadAllReleases();
  const seriesRegistry = loadSeriesRegistry();
  const artists = loadAllArtists();

  const activeReleases = releases.filter((r) => r.meta.active);
  const showSeriesFilter = hasActiveSeries();

  return (
    <ReleasesCatalog
      releases={activeReleases}
      seriesRegistry={seriesRegistry}
      artists={artists}
      showSeriesFilter={showSeriesFilter}
    />
  );
}
