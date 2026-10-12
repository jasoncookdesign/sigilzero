import { describe, it, expect, afterEach } from "vitest";
import {
  getReleaseStatus,
  isComingSoon,
  isNewRelease,
  localDayKey,
} from "./release-status";

describe("release status", () => {
  describe("isComingSoon", () => {
    it("is true when the release date is after today", () => {
      expect(isComingSoon("2026-10-16", "2026-10-15")).toBe(true);
    });

    it("is false on the release date itself", () => {
      expect(isComingSoon("2026-10-16", "2026-10-16")).toBe(false);
    });

    it("is false after the release date", () => {
      expect(isComingSoon("2026-10-16", "2026-10-17")).toBe(false);
    });

    it("compares across month and year boundaries", () => {
      expect(isComingSoon("2027-01-01", "2026-12-31")).toBe(true);
      expect(isComingSoon("2026-12-31", "2027-01-01")).toBe(false);
    });
  });

  describe("isNewRelease", () => {
    it("is true on the release date", () => {
      expect(isNewRelease("2026-10-16", "2026-10-16")).toBe(true);
    });

    it("is true on day 29 after release", () => {
      expect(isNewRelease("2026-10-01", "2026-10-30")).toBe(true);
    });

    it("is false from day 30 after release", () => {
      expect(isNewRelease("2026-10-01", "2026-10-31")).toBe(false);
    });

    it("counts days across a month boundary", () => {
      expect(isNewRelease("2026-01-20", "2026-02-18")).toBe(true);
      expect(isNewRelease("2026-01-20", "2026-02-19")).toBe(false);
    });

    it("is false before release", () => {
      expect(isNewRelease("2026-10-16", "2026-10-15")).toBe(false);
    });
  });

  describe("getReleaseStatus", () => {
    it("returns coming-soon before the release date", () => {
      expect(getReleaseStatus("2026-10-16", "2026-10-15")).toEqual({
        type: "coming-soon",
        label: "Coming Soon",
      });
    });

    it("returns new-release from the release date", () => {
      expect(getReleaseStatus("2026-10-16", "2026-10-16")).toEqual({
        type: "new-release",
        label: "New Release",
      });
    });

    it("returns no status once the release is older than 30 days", () => {
      expect(getReleaseStatus("2026-01-20", "2026-10-11")).toEqual({
        type: null,
        label: "",
      });
    });

    it("rejects a release date that is not a calendar date", () => {
      expect(() => getReleaseStatus("2026-27-02", "2026-10-11")).toThrow(RangeError);
      expect(() => getReleaseStatus("soon", "2026-10-11")).toThrow(RangeError);
    });

    it("rejects a today value that is not a calendar date", () => {
      expect(() => getReleaseStatus("2026-10-16", "")).toThrow(RangeError);
    });
  });

  describe("localDayKey", () => {
    const originalTz = process.env.TZ;
    afterEach(() => {
      process.env.TZ = originalTz;
    });

    it("formats the local calendar day of a moment", () => {
      expect(localDayKey(new Date(2026, 9, 6, 23, 59))).toBe("2026-10-06");
    });

    it("uses the local day east of UTC, where the UTC day is still the previous one", () => {
      process.env.TZ = "Europe/Berlin";
      // 00:30 on release day in Berlin is 22:30 UTC the day before.
      const justAfterMidnightBerlin = new Date("2026-10-15T22:30:00Z");
      expect(localDayKey(justAfterMidnightBerlin)).toBe("2026-10-16");
      expect(isComingSoon("2026-10-16", localDayKey(justAfterMidnightBerlin))).toBe(false);
    });

    it("uses the local day west of UTC, where the UTC day is already the next one", () => {
      process.env.TZ = "America/Chicago";
      // 23:30 on the day before release in Chicago is 04:30 UTC on release day.
      const lateEveningChicago = new Date("2026-10-16T04:30:00Z");
      expect(localDayKey(lateEveningChicago)).toBe("2026-10-15");
      expect(isComingSoon("2026-10-16", localDayKey(lateEveningChicago))).toBe(true);
    });
  });
});
