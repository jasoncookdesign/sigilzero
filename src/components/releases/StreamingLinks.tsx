import type { LinkGroup } from "../../lib/content/load-links";
import { platformLogos } from "./PlatformLogos";

type StreamingLinksProps = {
  streamingGroup?: LinkGroup | null;
  purchaseGroup?: LinkGroup | null;
};

export default function StreamingLinks({
  streamingGroup,
  purchaseGroup,
}: StreamingLinksProps) {
  // Filter out links with empty URLs
  const streamingLinks = (streamingGroup?.links ?? []).filter(
    (link) => link.url && link.url.trim() !== ""
  );
  const purchaseLinks = (purchaseGroup?.links ?? []).filter(
    (link) => link.url && link.url.trim() !== ""
  );

  if (streamingLinks.length === 0 && purchaseLinks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {streamingLinks.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium tracking-wide uppercase opacity-60">
            Stream
          </h3>
          <div className="flex flex-wrap gap-2">
            {streamingLinks.map((link, idx) => {
              const platform = link.platform?.toLowerCase() || link.name.toLowerCase();
              const logo = platformLogos[platform];

              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600"
                  title={link.name}
                >
                  {logo ? (
                    <div className="flex items-center justify-center">{logo}</div>
                  ) : (
                    <span>🎵</span>
                  )}
                  <span>{link.name}</span>
                  <span className="text-xs opacity-60">↗</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {purchaseLinks.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium tracking-wide uppercase opacity-60">
            Buy
          </h3>
          <div className="flex flex-wrap gap-2">
            {purchaseLinks.map((link, idx) => {
              const platform = link.platform?.toLowerCase() || link.name.toLowerCase();
              const logo = platformLogos[platform];

              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600"
                  title={link.name}
                >
                  {logo ? (
                    <div className="flex items-center justify-center">{logo}</div>
                  ) : (
                    <span>💿</span>
                  )}
                  <span>{link.name}</span>
                  <span className="text-xs opacity-60">↗</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

