import { loadYamlFile } from "./load-yaml";

export type LabelMeta = {
  name: string;
  tagline?: string;
  contact_email?: string;
  booking_email?: string;
  demo_email?: string;
  location?: string;
  founded_year?: number;
  social?: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
    [key: string]: string | undefined;
  };
};

export function loadLabelMeta(): LabelMeta {
  return loadYamlFile<LabelMeta>("label.yml");
}
