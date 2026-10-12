import path from "path";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ZodError } from "zod";
import { loadAllReleases } from "./load-releases";
import { loadAllMixtapes } from "./load-mixtapes";
import { loadAllArtists } from "./load-artists";
import { loadAllSeries } from "./load-series";

// Loaders read `<cwd>/content/<type>`. These tests point cwd at fixture trees
// whose answers are known, instead of asserting properties of live content.
const FIXTURES = path.join(__dirname, "__fixtures__");

function useContentRoot(name: "ordered" | "invalid") {
  vi.spyOn(process, "cwd").mockReturnValue(path.join(FIXTURES, name));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("content loaders (fixture contract)", () => {
  describe("ordering", () => {
    // Fixture files are named alpha/bravo/charlie so directory order is neither
    // newest-first nor oldest-first: only a real descending date sort passes.
    it("loadAllReleases returns releases newest first", () => {
      useContentRoot("ordered");
      expect(loadAllReleases().map((d) => d.meta.slug)).toEqual(["bravo", "alpha", "charlie"]);
    });

    it("loadAllMixtapes returns mixtapes newest first", () => {
      useContentRoot("ordered");
      expect(loadAllMixtapes().map((d) => d.meta.slug)).toEqual([
        "bravo-mix",
        "alpha-mix",
        "charlie-mix",
      ]);
    });
  });

  describe("schema validation", () => {
    it("loadAllReleases rejects a release with an unknown type", () => {
      useContentRoot("invalid");
      expect(() => loadAllReleases()).toThrow(ZodError);
    });

    it("loadAllMixtapes rejects a mixtape with an unknown platform", () => {
      useContentRoot("invalid");
      expect(() => loadAllMixtapes()).toThrow(ZodError);
    });

    it("loadAllArtists rejects an artist with an unknown role", () => {
      useContentRoot("invalid");
      expect(() => loadAllArtists()).toThrow(ZodError);
    });

    it("loadAllSeries rejects a series with an empty short label", () => {
      useContentRoot("invalid");
      expect(() => loadAllSeries()).toThrow(ZodError);
    });
  });

  describe("schema defaults are applied to valid files", () => {
    // Fixtures omit these fields; only parsing through the schema fills them.
    it("releases get status, active, genres, and tracks defaults", () => {
      useContentRoot("ordered");
      const meta = loadAllReleases()[0]!.meta;
      expect(meta.status).toBe("released");
      expect(meta.active).toBe(true);
      expect(meta.genres).toEqual([]);
      expect(meta.tracks).toEqual([]);
    });

    it("mixtapes get active, tags, and featured defaults", () => {
      useContentRoot("ordered");
      const meta = loadAllMixtapes()[0]!.meta;
      expect(meta.active).toBe(true);
      expect(meta.tags).toEqual([]);
      expect(meta.featured).toBe(false);
    });

    it("artists get active and featured list defaults", () => {
      useContentRoot("ordered");
      const meta = loadAllArtists()[0]!.meta;
      expect(meta.active).toBe(true);
      expect(meta.featured_releases).toEqual([]);
    });

    it("series get active and default_genres defaults", () => {
      useContentRoot("ordered");
      const meta = loadAllSeries()[0]!.meta;
      expect(meta.active).toBe(true);
      expect(meta.default_genres).toEqual([]);
    });
  });
});

describe("content loaders reject invalid dates", () => {
  it("loadAllReleases rejects a release dated 2026-27-02", () => {
    vi.spyOn(process, "cwd").mockReturnValue(path.join(FIXTURES, "invalid-dates"));
    expect(() => loadAllReleases()).toThrow(ZodError);
  });

  it("loadAllMixtapes rejects a mixtape dated 2026-27-02", () => {
    vi.spyOn(process, "cwd").mockReturnValue(path.join(FIXTURES, "invalid-dates"));
    expect(() => loadAllMixtapes()).toThrow(ZodError);
  });
});
