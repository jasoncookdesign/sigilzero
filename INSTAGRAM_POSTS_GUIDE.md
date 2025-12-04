# Instagram Feed Integration

The artist pages automatically fetch and display the latest 3 Instagram posts for each artist.

## Setup

### 1. Get Instagram Access Token

1. Visit [Instagram Graph API](https://developers.facebook.com/docs/instagram-graph-api)
2. Create a Meta Business account and app
3. Generate a long-lived access token (User Token)
4. Set the token in your environment:
   ```bash
   export INSTAGRAM_ACCESS_TOKEN="your_access_token_here"
   ```

### 2. Update Artist Files

Ensure each artist's markdown file includes their Instagram handle:

```yaml
---
id: "b-squared"
name: "B²"
# ... other fields ...

instagram_handle: "b_squared.dj"
---
```

That's it! The feed will automatically fetch and display posts during build.

## How It Works

- **Build-time fetching**: Posts are fetched when you run `npm run build`
- **Graph API**: Uses Instagram Graph API's `business_discovery` endpoint to fetch media
- **Graceful fallback**: If the API is unavailable or token is missing, pages still render without errors
- **Cache**: Posts are baked into the static export (no runtime API calls)
- **Limit**: Only first 3 posts are displayed per artist

## Image Types

The component supports:
- **Images** (IMAGE)
- **Videos** (VIDEO) 
- **Carousels** (CAROUSEL_ALBUM)

## Troubleshooting

- **No posts showing**: Check that `INSTAGRAM_ACCESS_TOKEN` is set during build
- **API errors**: Review build logs for `[Instagram]` warnings
- **Missing handle**: Ensure `instagram_handle` is in the artist's YAML frontmatter
- **Rate limits**: Instagram Graph API has rate limits; if building many artist pages, spread builds over time

## Environment Variables

Add to `.env.local` or CI/CD:
```
INSTAGRAM_ACCESS_TOKEN=your_token_here
```

