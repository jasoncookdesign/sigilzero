import { z } from "zod";

// Expand this union if you add more role types later
const RoleEnum = z.enum(["producer", "dj", "live", "vocalist"]);

export const ArtistSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),

  roles: z.array(RoleEnum).nonempty(),

  location: z.string().min(1).optional(),
  for_fans_of: z.array(z.string()).default([]),

  photo: z.string().min(1).optional(),

  instagram_handle: z.string().optional(),
  social: z
    .object({
      instagram: z.string().url().optional(),
      soundcloud: z.string().url().optional(),
      spotify: z.string().url().optional(),
      bandcamp: z.string().url().optional(),
      youtube: z.string().url().optional(),
      other: z.array(z.string().url()).optional(),
    })
    .partial()
    .optional(),

  booking_email: z.string().email().optional(),
  management_email: z.string().email().optional().or(z.literal("")),

  label_join_year: z.number().int().optional(),
  active: z.boolean().default(true),

  featured_releases: z.array(z.string()).default([]),
  featured_mixtapes: z.array(z.string()).default([]),

  genres_primary: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // Markdown body will be handled separately (not in frontmatter)
});

export type Artist = z.infer<typeof ArtistSchema>;
