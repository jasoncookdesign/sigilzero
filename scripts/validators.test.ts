// @vitest-environment node
import path from "path";
import { spawnSync } from "child_process";
import { describe, it, expect } from "vitest";

// Runs each content validator script against a fixture tree containing one
// invalid file per content type and checks it reports the problem.
const ROOT = path.resolve(__dirname, "..");
const INVALID = path.join(ROOT, "src/lib/content/__fixtures__/invalid");

function runValidator(script: string, cwd: string) {
  const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", script)], {
    cwd,
    encoding: "utf8",
  });
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

const cases = [
  { script: "validate-releases.mjs", file: "bad-type.md", field: "type" },
  { script: "validate-mixtapes.mjs", file: "bad-platform.md", field: "platform" },
  { script: "validate-artists.mjs", file: "bad-role.md", field: "roles.0" },
  { script: "validate-series.mjs", file: "bad-series.md", field: "short_label" },
];

describe("content validator scripts", () => {
  for (const { script, file, field } of cases) {
    it(`${script} reports the invalid field instead of crashing`, () => {
      const { status, output } = runValidator(script, INVALID);

      expect(output).not.toMatch(/TypeError/);
      expect(output).toContain("Invalid: 1/1");
      expect(output).toContain(file);
      expect(output).toMatch(new RegExp(`• ${field.replace(".", "\\.")}: \\S`));
      expect(status).toBe(1);
    });
  }

  const INVALID_DATES = path.join(ROOT, "src/lib/content/__fixtures__/invalid-dates");
  for (const { script, field } of [
    { script: "validate-releases.mjs", field: "release_date" },
    { script: "validate-mixtapes.mjs", field: "date" },
  ]) {
    it(`${script} rejects a date that is not a calendar date`, () => {
      const { status, output } = runValidator(script, INVALID_DATES);

      expect(output).toContain("bad-date.md");
      expect(output).toMatch(new RegExp(`• ${field}: \\S`));
      expect(status).toBe(1);
    });
  }
});
