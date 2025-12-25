#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
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
  streaming: z.string().optional(),
  purchase: z.string().optional(),
  other: z.string().optional(),
});

const ReleaseSchema = z.object({
  catalog_number: z.string().min(1),
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  type: ReleaseTypeEnum,
  series_id: z.string().min(1),
  primary_artists: z.array(z.string()).nonempty(),
  remix_artists: z.array(z.string()).optional().default([]),
  release_date: z.string().min(1),
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
});

const dir = path.join(process.cwd(), "content", "releases");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

console.log(`\n🔍 Validating ${files.length} Release files...\n`);

const results = [];
const issues = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  const { data } = matter(fs.readFileSync(filePath, "utf-8"));

  const result = { file, slug: data.slug, title: data.title, valid: false, errors: [], warnings: [], fieldOrder: Object.keys(data) };

  try {
    ReleaseSchema.parse(data);
    result.valid = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.errors = error.errors.map((e) => ({ path: e.path.join("."), message: e.message }));
    }
  }

  if (data.id !== data.slug) result.warnings.push(`id "${data.id}" doesn't match slug "${data.slug}"`);

  results.push(result);
  if (!result.valid || result.warnings.length > 0) issues.push(result);
}

console.log("═".repeat(80));
console.log("VALIDATION SUMMARY");
console.log("═".repeat(80));

const validCount = results.filter((r) => r.valid).length;
console.log(`\n✓ Valid:   ${validCount}/${results.length}`);
console.log(`✗ Invalid: ${results.length - validCount}/${results.length}\n`);

if (issues.length > 0) {
  console.log("═".repeat(80));
  console.log("ISSUES FOUND");
  console.log("═".repeat(80));

  for (const issue of issues) {
    console.log(`\n📄 ${issue.file}`);
    console.log(`   Title: ${issue.title || "N/A"}`);

    if (issue.errors.length > 0) {
      console.log("\n   ❌ ERRORS:");
      issue.errors.forEach((err) => console.log(`      • ${err.path || "root"}: ${err.message}`));
    }

    if (issue.warnings.length > 0) {
      console.log("\n   ⚠️  WARNINGS:");
      issue.warnings.forEach((warn) => console.log(`      • ${warn}`));
    }
  }
}

const fieldOrders = results.map((r) => r.fieldOrder);
const firstOrder = fieldOrders[0];
const inconsistent = results.filter((r) => JSON.stringify(r.fieldOrder) !== JSON.stringify(firstOrder));

console.log("\n" + "═".repeat(80));
console.log("FIELD ORDER ANALYSIS");
console.log("═".repeat(80));

if (inconsistent.length > 0) {
  console.log(`\n⚠️  ${inconsistent.length} file(s) have different field ordering\n`);
} else {
  console.log("\n✓ All files have consistent field ordering");
}

console.log("\n" + "═".repeat(80));

process.exit(issues.length > 0 ? 1 : 0);
