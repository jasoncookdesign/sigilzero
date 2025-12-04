import { z } from "zod";

const PlatformEnum = z.enum(["youtube", "soundcloud", "mixcloud", "other"]);

export const MixtapeSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),

  artist_id: z.string().min(1),

  title: z.string().min(1),

  event_name: z.string().optional(),
  event_series: z.string().optional(),

  date: z.string().min(1), // ISO string in frontmatter, e.g. "2025-08-14"
  location: z.string().optional(),

  platform: PlatformEnum,
  embed_url: z.string().url(),
  external_url: z.string().url().optional(),

  duration_minutes: z.number().int().optional(),

  cover_image: z.string().min(1),
  thumbnail_image: z.string().optional(),

  genres: z.array(z.string()).default([]),
  moods: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  featured: z.boolean().default(false),

  related_releases: z.array(z.string()).default([]),

  // Mixtape description body will be markdown outside frontmatter
});

export type Mixtape = z.infer<typeof MixtapeSchema>;
