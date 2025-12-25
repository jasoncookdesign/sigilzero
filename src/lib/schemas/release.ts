import { z } from "zod";

const ReleaseTypeEnum = z.enum(["single", "maxi-single", "ep", "album"]);
const ReleaseStatusEnum = z.enum(["released", "upcoming", "promo-only"]);

const TrackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  position: z.number().int().positive(),

  primary_artists: z.array(z.string()).nonempty(),
  remix_artists: z.array(z.string()).optional().default([]),
  featured_artists: z.array(z.string()).optional().default([]),

  isrc: z.string().optional(),
  bpm: z.number().int().optional(),
  key: z.string().optional(),
  duration_seconds: z.number().int().optional(),

  preview_url: z.string().url().optional().or(z.literal("")),
});


const LinkGroupsSchema = z.object({
  streaming: z.string().optional(), // IDs referencing data/links.yml
  purchase: z.string().optional(),
  other: z.string().optional(),
});

export const ReleaseSchema = z.object({
  catalog_number: z.string().min(1),
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),

  type: ReleaseTypeEnum,
  series_id: z.string().min(1),

  primary_artists: z.array(z.string()).nonempty(),
  remix_artists: z.array(z.string()).optional().default([]),

  release_date: z.string().min(1), // keep as ISO-ish string; you can refine later
  preorder_date: z.string().optional(),

  status: ReleaseStatusEnum.default("released"),

  genres: z.array(z.string()).default([]),
  moods: z.array(z.string()).default([]),

  bpm_range: z.string().optional(),
  key_center: z.string().optional(),

  cover_art: z.string().min(1),
  background_art: z.string().optional(),

  label_copy_short: z.string().optional(),
  flagship: z.boolean().default(false),
  active: z.boolean().default(true),

  link_groups: LinkGroupsSchema.optional(),

  tracks: z.array(TrackSchema).default([]),

  dj_use_cases: z.array(z.string()).default([]),
  playlists_featured_on: z.array(z.string()).default([]),

  // Markdown body / release notes live outside frontmatter
});

export type Track = z.infer<typeof TrackSchema>;
export type Release = z.infer<typeof ReleaseSchema>;
