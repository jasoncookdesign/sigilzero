import { loadYamlFile } from "./load-yaml";

export type LinkItem = {
  name: string;
  platform?: string;
  url: string;
};

export type LinkGroup = {
  label?: string;
  links: LinkItem[];
};

export type LinksYaml = {
  link_groups: Record<string, LinkGroup>;
};

export function loadAllLinkGroups(): LinksYaml {
  return loadYamlFile<LinksYaml>("links.yml");
}

export function loadLinkGroupById(id: string): LinkGroup | null {
  const all = loadAllLinkGroups();
  return all.link_groups[id] ?? null;
}
