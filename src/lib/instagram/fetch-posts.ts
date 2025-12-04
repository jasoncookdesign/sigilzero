// src/lib/instagram/fetch-posts.ts

export type InstagramPost = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
};

/**
 * Fetch recent Instagram posts for a given handle.
 * Uses Instagram Graph API (requires INSTAGRAM_ACCESS_TOKEN env var).
 *
 * @param handle - Instagram username/handle (without @)
 * @param limit - Number of posts to fetch (default: 3)
 * @returns Array of posts or empty array if fetch fails
 */
export async function fetchInstagramPosts(
  handle: string,
  limit: number = 3
): Promise<InstagramPost[]> {
  if (!handle) return [];

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.warn(`[Instagram] INSTAGRAM_ACCESS_TOKEN not set. Skipping fetch for @${handle}`);
    return [];
  }

  try {
    // Step 1: Get user ID from username
    const userUrl = new URL("https://graph.instagram.com/ig_hashtag_search");
    userUrl.searchParams.set("user_id", "17841400821477589"); // SIGIL.ZERO business account ID
    userUrl.searchParams.set("fields", "id,username");
    userUrl.searchParams.set("access_token", token);

    // Actually, we need a simpler approach: use the Business Discovery API
    // which requires the user's business account ID. For now, we'll use a direct approach.

    // Step 1: Search for user by username
    const searchUrl = new URL("https://graph.instagram.com/ig_user_search");
    searchUrl.searchParams.set("user_id", "17841400821477589"); // main SIGIL.ZERO account
    searchUrl.searchParams.set("fields", "id,username");
    searchUrl.searchParams.set("access_token", token);

    // Simpler approach: use business_discovery API
    const discoveryUrl = new URL("https://graph.instagram.com/me");
    discoveryUrl.searchParams.set("fields", `business_discovery.username(${handle}){id,username,media.limit(${limit}){id,media_type,media_url,permalink,caption,timestamp}}`);
    discoveryUrl.searchParams.set("access_token", token);

    const discoveryRes = await fetch(discoveryUrl.toString());
    if (!discoveryRes.ok) {
      console.warn(`[Instagram] Failed to fetch for @${handle}: ${discoveryRes.statusText}`);
      return [];
    }

    const discoveryData = await discoveryRes.json();

    if (discoveryData.error) {
      console.warn(`[Instagram] API error for @${handle}: ${discoveryData.error.message}`);
      return [];
    }

    const businessData = discoveryData.business_discovery;
    if (!businessData || !businessData.media || !businessData.media.data) {
      console.warn(`[Instagram] No media found for @${handle}`);
      return [];
    }

    return businessData.media.data.slice(0, limit);
  } catch (error) {
    console.warn(`[Instagram] Error fetching posts for @${handle}:`, error);
    return [];
  }
}

/**
 * Safely fetch Instagram posts with fallback.
 * Returns empty array if anything fails.
 */
export async function safeGetInstagramPosts(
  handle?: string | null,
  limit: number = 3
): Promise<InstagramPost[]> {
  if (!handle) return [];
  try {
    return await fetchInstagramPosts(handle, limit);
  } catch (error) {
    console.error(`[Instagram] Unexpected error for @${handle}:`, error);
    return [];
  }
}
