import fs from "fs";
import path from "path";

export function getContentDir(subdir: string) {
  return path.join(process.cwd(), "content", subdir);
}

export function getMarkdownFilesInDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

export function readMarkdownFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
