#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const SeriesSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  short_label: z.string().min(1),
  order: z.number().int().optional(),
  color_hex: z.string().optional(),
  accent_hex: z.string().optional(),
  background_hex: z.string().optional(),
  glyph: z.string().optional(),
  default_genres: z.array(z.string()).default([]),
  tagline: z.string().optional(),
  active: z.boolean().default(true),
});

const dir = path.join(process.cwd(), "content", "series");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

console.log(`\n🔍 Validating ${files.length} Series files...\n`);

const results = [];
const issues = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  const { data } = matter(fs.readFileSync(filePath, "utf-8"));

  const result = { file, slug: data.slug, name: data.name, valid: false, errors: [], warnings: [], fieldOrder: Object.keys(data) };

  try {
    SeriesSchema.parse(data);
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
    console.log(`   Name: ${issue.name || "N/A"}`);

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
