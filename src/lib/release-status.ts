/**
 * Release status from calendar dates.
 *
 * Dates are calendar days in `YYYY-MM-DD` form. `today` is passed in rather
 * than read from the clock, so the same rule runs at build time (with the
 * build day) and in the browser (with the visitor's local day). See
 * `useToday` for how pages get `today`.
 */

export type ReleaseStatus = {
  type: "coming-soon" | "new-release" | null;
  label: string;
};

const NEW_RELEASE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Days since 1970-01-01 for a `YYYY-MM-DD` calendar date. Throws RangeError if it isn't one. */
function dayNumber(day: string): number {
  const match = DAY_KEY.exec(day);
  if (!match) throw new RangeError(`Not a YYYY-MM-DD date: "${day}"`);
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const ms = Date.UTC(y, m - 1, d);
  const check = new Date(ms);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    throw new RangeError(`Not a calendar date: "${day}"`);
  }
  return ms / DAY_MS;
}

/** The local calendar day of a moment, as `YYYY-MM-DD`. */
export function localDayKey(moment: Date): string {
  const y = String(moment.getFullYear()).padStart(4, "0");
  const m = String(moment.getMonth() + 1).padStart(2, "0");
  const d = String(moment.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** True when the release date is after `today`. */
export function isComingSoon(releaseDate: string, today: string): boolean {
  return dayNumber(releaseDate) > dayNumber(today);
}

/** True from the release date through day 29 after it. */
export function isNewRelease(releaseDate: string, today: string): boolean {
  const age = dayNumber(today) - dayNumber(releaseDate);
  return age >= 0 && age < NEW_RELEASE_DAYS;
}

export function getReleaseStatus(releaseDate: string, today: string): ReleaseStatus {
  if (isComingSoon(releaseDate, today)) {
    return { type: "coming-soon", label: "Coming Soon" };
  }
  if (isNewRelease(releaseDate, today)) {
    return { type: "new-release", label: "New Release" };
  }
  return { type: null, label: "" };
}
