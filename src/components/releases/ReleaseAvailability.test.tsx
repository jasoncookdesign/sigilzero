import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReleaseStatusText, ReleaseStreamingLinks } from "./ReleaseAvailability";
import { localDayKey } from "../../lib/release-status";

function dayOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localDayKey(d);
}

const streamingGroup = {
  links: [{ name: "Spotify", platform: "spotify", url: "https://open.spotify.com/album/x" }],
};
const purchaseGroup = {
  links: [{ name: "Beatport", platform: "beatport", url: "https://www.beatport.com/release/x" }],
};

describe("ReleaseStreamingLinks", () => {
  it("renders stream and buy controls without links before the release date", () => {
    render(
      <ReleaseStreamingLinks
        releaseDate={dayOffset(1)}
        streamingGroup={streamingGroup}
        purchaseGroup={purchaseGroup}
      />
    );
    expect(screen.getByText("Spotify")).toBeInTheDocument();
    expect(screen.getByText("Beatport")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders live stream and buy links on the release date", () => {
    render(
      <ReleaseStreamingLinks
        releaseDate={dayOffset(0)}
        streamingGroup={streamingGroup}
        purchaseGroup={purchaseGroup}
      />
    );
    expect(screen.getByRole("link", { name: /Spotify/ })).toHaveAttribute(
      "href",
      "https://open.spotify.com/album/x"
    );
    expect(screen.getByRole("link", { name: /Beatport/ })).toHaveAttribute(
      "href",
      "https://www.beatport.com/release/x"
    );
  });
});

describe("ReleaseStatusText", () => {
  it("says Coming Soon before the release date", () => {
    render(<ReleaseStatusText releaseDate={dayOffset(3)} />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("says New Release on the release date", () => {
    render(<ReleaseStatusText releaseDate={dayOffset(0)} />);
    expect(screen.getByText("New Release")).toBeInTheDocument();
  });

  it("renders nothing for an older release", () => {
    const { container } = render(<ReleaseStatusText releaseDate="2022-12-21" />);
    expect(container).toBeEmptyDOMElement();
  });
});
