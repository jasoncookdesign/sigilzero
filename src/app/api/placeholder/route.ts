import { NextResponse } from "next/server";
import { buildPlaceholdUrl } from "../../../lib/placehold";

// Ensure this route is treated as static for static HTML export
export const dynamic = "force-static";
export const revalidate = 0;

/**
 * Static redirect endpoint for generating placehold.co URLs.
 * This variant does not inspect the filesystem and is compatible with static export.
 * Query params:
 *  - w: width (required)
 *  - h: height (optional)
 *  - bg: background color (hex or name)
 *  - fg: text color
 *  - text: override text
 *  - format: png|svg|jpeg|webp|avif|gif
 *  - retina: 2 or 3
 * Example: `/api/placeholder?w=600&h=400&bg=000&fg=fff&text=Missing+Image`
 */
export function GET(req: Request) {
  const url = new URL(req.url);
  const w = url.searchParams.get("w") ?? undefined;
  const h = url.searchParams.get("h") ?? undefined;
  const bg = url.searchParams.get("bg") ?? undefined;
  const fg = url.searchParams.get("fg") ?? undefined;
  const text = url.searchParams.get("text") ?? undefined;
  const format = (url.searchParams.get("format") as any) ?? undefined;
  const retinaParam = url.searchParams.get("retina");

  if (!w) {
    return NextResponse.json({ error: "width (w) is required" }, { status: 400 });
  }

  const opts: any = { width: parseInt(w, 10) };
  if (h) opts.height = parseInt(h, 10);
  if (bg) opts.background = bg;
  if (fg) opts.color = fg;
  if (text) opts.text = text;
  if (format) opts.format = format;
  if (retinaParam) {
    const r = parseInt(retinaParam, 10);
    if (r === 2 || r === 3) opts.retina = r;
  }

  const placehold = buildPlaceholdUrl(opts);
  return NextResponse.redirect(placehold);
}
