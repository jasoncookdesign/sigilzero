import { describe, it, expect, afterEach } from "vitest";
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { useToday } from "./use-today";
import { localDayKey } from "./release-status";

function Today() {
  return <span data-testid="today">{useToday()}</span>;
}

describe("useToday", () => {
  const original = process.env.SIGILZERO_BUILD_DAY;
  afterEach(() => {
    if (original === undefined) delete process.env.SIGILZERO_BUILD_DAY;
    else process.env.SIGILZERO_BUILD_DAY = original;
    document.body.innerHTML = "";
  });

  it("renders the build day on the server", () => {
    process.env.SIGILZERO_BUILD_DAY = "2000-01-01";
    expect(renderToString(<Today />)).toContain("2000-01-01");
  });

  it("replaces the build day with the visitor's local day after hydration", async () => {
    process.env.SIGILZERO_BUILD_DAY = "2000-01-01";
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Today />);
    document.body.appendChild(container);

    const errors: unknown[] = [];
    await act(async () => {
      hydrateRoot(container, <Today />, {
        onRecoverableError: (error) => errors.push(error),
      });
    });

    expect(container.textContent).toBe(localDayKey(new Date()));
    // A clean hydration: the first client render matched the server HTML.
    expect(errors).toEqual([]);
  });
});
