/**
 * Utility functions for release status badges
 */

/**
 * Determines if a release is upcoming (hasn't been released yet)
 */
export function isComingSoon(releaseDate: string): boolean {
  const releaseDay = new Date(releaseDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return releaseDay > today;
}

/**
 * Determines if a release is recent (released within the last 30 days)
 */
export function isNewRelease(releaseDate: string): boolean {
  const releaseDay = new Date(releaseDate);
  const today = new Date();
  
  // Only consider released releases (not future)
  if (isComingSoon(releaseDate)) {
    return false;
  }
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  return releaseDay >= thirtyDaysAgo;
}

/**
 * Gets the release status badge info
 */
export function getReleaseStatus(releaseDate: string): { type: "coming-soon" | "new-release" | null; label: string } {
  if (isComingSoon(releaseDate)) {
    return { type: "coming-soon", label: "Coming Soon" };
  }
  
  if (isNewRelease(releaseDate)) {
    return { type: "new-release", label: "New Release" };
  }
  
  return { type: null, label: "" };
}
