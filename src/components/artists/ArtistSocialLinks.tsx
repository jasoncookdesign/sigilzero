import { platformLogos } from "../releases/PlatformLogos";
import type { Artist } from "../../lib/schemas/artist";

type Props = {
  social?: Artist["social"];
  className?: string;
};

export default function ArtistSocialLinks({ social, className }: Props) {
  if (!social) return null;

  const entries: Array<{ key: string; name: string; url: string }> = [];

  if (social.instagram) entries.push({ key: "instagram", name: "Instagram", url: social.instagram });
  if (social.soundcloud) entries.push({ key: "soundcloud", name: "SoundCloud", url: social.soundcloud });
  if (social.spotify) entries.push({ key: "spotify", name: "Spotify", url: social.spotify });
  if (social.bandcamp) entries.push({ key: "bandcamp", name: "Bandcamp", url: social.bandcamp });
  if (social.youtube) entries.push({ key: "youtube", name: "YouTube", url: social.youtube });

  // Optionally include 'other' links as generic buttons
  if (Array.isArray(social.other)) {
    for (const item of social.other) {
      if (typeof item === "string") {
        entries.push({ key: "link", name: "Link", url: item });
      } else if (item && typeof item === "object") {
        const platformKey = item.platform?.toLowerCase() ?? "link";
        entries.push({ key: platformKey, name: item.title, url: item.url });
      }
    }
  }

  if (entries.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {entries.map((item, idx) => {
          const logo = platformLogos[item.key];
          return (
            <a
              key={`${item.key}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600"
              title={item.name}
            >
              {logo ? (
                <div className="flex items-center justify-center">{logo}</div>
              ) : (
                <span>🔗</span>
              )}
              <span>{item.name}</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
