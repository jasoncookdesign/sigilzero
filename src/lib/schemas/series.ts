import { z } from "zod";

export const SeriesSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),

  name: z.string().min(1),
  short_label: z.string().min(1),

  order: z.number().int().optional(),

  color_hex: z.string().optional(),
  accent_hex: z.string().optional(),
  background_hex: z.string().optional(),

  glyph: z.string().optional(), // path to SVG or image

  default_genres: z.array(z.string()).default([]),

  tagline: z.string().optional(),

  active: z.boolean().default(true),

  // Any series-specific description body will be markdown in the MD file
});

export type Series = z.infer<typeof SeriesSchema>;
