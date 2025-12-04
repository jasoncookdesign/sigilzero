import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export function loadYamlFile<T = unknown>(relativePath: string): T {
  const fullPath = path.join(process.cwd(), "data", relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  return yaml.load(raw) as T;
}
