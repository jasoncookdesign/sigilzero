#!/usr/bin/env node
/**
 * Validate Artist markdown files against the Zod schema
 * and check for formatting inconsistencies
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const RoleEnum = z.enum(["producer", "dj", "live", "vocalist"]);

const ArtistSchema = z.object({
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
      other: z
        .array(
          z.union([
            z.string().url(),
            z.object({
              title: z.string().min(1),
              url: z.string().url(),
              platform: z.string().optional(),
            }),
          ])
        )
        .optional(),
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
});

const artistsDir = path.join(process.cwd(), "content", "artists");
const files = fs.readdirSync(artistsDir).filter((f) => f.endsWith(".md"));

console.log(`\n🔍 Validating ${files.length} Artist files...\n`);

const results = [];
const issues = [];

for (const file of files) {
  const filePath = path.join(artistsDir, file);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const result = {
    file,
    slug: data.slug,
    name: data.name,
    valid: false,
    errors: [],
    warnings: [],
    fieldOrder: Object.keys(data),
  };

  // Validate against schema
  try {
    ArtistSchema.parse(data);
    result.valid = true;
  } catch (error) {
    result.valid = false;
    if (error instanceof z.ZodError) {
      result.errors = error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
        code: e.code,
      }));
    }
  }

  // Check for formatting issues
  if (data.social) {
    // Check for empty string URLs (should be omitted or valid URLs)
    for (const [key, value] of Object.entries(data.social)) {
      if (value === "") {
        result.warnings.push(`social.${key} is empty string (should be omitted or valid URL)`);
      }
    }
  }

  // Check if id matches slug
  if (data.id !== data.slug) {
    result.warnings.push(`id "${data.id}" doesn't match slug "${data.slug}"`);
  }

  // Check for excessive leading/trailing blank lines in body (allow one newline)
  if (content) {
    const leadingNewlines = (content.match(/^\n+/)?.[0].length || 0);
    const trailingNewlines = (content.match(/\n+$/)?.[0].length || 0);
    if (leadingNewlines > 1 || trailingNewlines > 1) {
      result.warnings.push("Markdown body has excessive leading/trailing blank lines");
    }
  }

  results.push(result);

  if (!result.valid || result.warnings.length > 0) {
    issues.push(result);
  }
}

// Report results
console.log("═".repeat(80));
console.log("VALIDATION SUMMARY");
console.log("═".repeat(80));

const validCount = results.filter((r) => r.valid).length;
const invalidCount = results.length - validCount;

console.log(`\n✓ Valid:   ${validCount}/${results.length}`);
console.log(`✗ Invalid: ${invalidCount}/${results.length}\n`);

if (issues.length > 0) {
  console.log("═".repeat(80));
  console.log("ISSUES FOUND");
  console.log("═".repeat(80));

  for (const issue of issues) {
    console.log(`\n📄 ${issue.file}`);
    console.log(`   Name: ${issue.name || "N/A"}`);
    console.log(`   Slug: ${issue.slug || "N/A"}`);

    if (issue.errors.length > 0) {
      console.log("\n   ❌ ERRORS:");
      issue.errors.forEach((err) => {
        console.log(`      • ${err.path || "root"}: ${err.message}`);
      });
    }

    if (issue.warnings.length > 0) {
      console.log("\n   ⚠️  WARNINGS:");
      issue.warnings.forEach((warn) => {
        console.log(`      • ${warn}`);
      });
    }
  }
}

// Check field order consistency
console.log("\n" + "═".repeat(80));
console.log("FIELD ORDER ANALYSIS");
console.log("═".repeat(80));

const fieldOrders = results.map((r) => r.fieldOrder);
const firstOrder = fieldOrders[0];
const inconsistentOrders = results.filter(
  (r) => JSON.stringify(r.fieldOrder) !== JSON.stringify(firstOrder)
);

if (inconsistentOrders.length > 0) {
  console.log(`\n⚠️  ${inconsistentOrders.length} file(s) have different field ordering:\n`);
  console.log(`Reference order (${results[0].file}):`);
  console.log(`   ${firstOrder.join(", ")}\n`);
  
  inconsistentOrders.forEach((r) => {
    console.log(`${r.file}:`);
    console.log(`   ${r.fieldOrder.join(", ")}`);
  });
} else {
  console.log("\n✓ All files have consistent field ordering");
}

console.log("\n" + "═".repeat(80));

process.exit(issues.length > 0 ? 1 : 0);
