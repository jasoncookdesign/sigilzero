export type PlaceholdOptions = {
  width: number;
  height?: number;
  format?: "png" | "svg" | "jpeg" | "jpg" | "webp" | "avif" | "gif";
  background?: string; // hex or css name
  color?: string; // text color
  text?: string;
  font?: string;
  retina?: 2 | 3;
};

const DEFAULT_BG = "EEE";
const DEFAULT_FG = "31343C";

/**
 * Build a placehold.co URL with given dimensions and options.
 * Safe to use in both client and server contexts.
 */
export function buildPlaceholdUrl(opts: PlaceholdOptions): string {
  const width = Math.max(10, Math.min(4000, Math.floor(opts.width)));
  const height = opts.height ? Math.max(10, Math.min(4000, Math.floor(opts.height))) : undefined;
  const size = height ? `${width}x${height}` : `${width}`;

  const format = opts.format ?? "png";
  const bg = opts.background ?? DEFAULT_BG;
  const fg = opts.color ?? DEFAULT_FG;

  // base path like /600x400/000/FFF.png
  const extPart = `.${format}`;
  const colorPart = `${encodeURIComponent(String(bg))}/${encodeURIComponent(String(fg))}`;

  let url = `https://placehold.co/${size}/${colorPart}${extPart}`;

  const qs = new URLSearchParams();
  if (opts.text) qs.set("text", String(opts.text));
  if (opts.font) qs.set("font", String(opts.font));
  if (opts.retina && (format !== "svg")) qs.set("@", `${opts.retina}x`);

  const q = qs.toString();
  if (q) url += `?${q}`;

  return url;
}

export default {
  buildPlaceholdUrl,
};
