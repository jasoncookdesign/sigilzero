import { loadYamlFile } from "./load-yaml";

export type SeriesRegistryItem = {
  id: string;
  slug: string;
  name: string;
  short_label?: string;
  description?: string;
  order?: number;
  color_hex?: string;
  accent_hex?: string;
};

export function loadSeriesRegistry(): SeriesRegistryItem[] {
  return loadYamlFile<SeriesRegistryItem[]>("series.yml");
}
