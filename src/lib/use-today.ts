import { useSyncExternalStore } from "react";
import { localDayKey } from "./release-status";

// The day never changes from outside React while a page is open in a way we
// need to react to, so there is nothing to subscribe to.
const subscribe = () => () => {};

const clientDay = () => localDayKey(new Date());

/**
 * The day the static HTML was built for. `next.config.mjs` sets
 * SIGILZERO_BUILD_DAY at build time and inlines it into the client bundle, so
 * server render and hydration agree. Outside a Next build it falls back to now.
 */
const buildDay = () => process.env.SIGILZERO_BUILD_DAY ?? clientDay();

/**
 * Today's date as `YYYY-MM-DD`. Static HTML carries the build day; after
 * hydration the component re-renders with the visitor's local day, so
 * date-driven state (release status, availability windows) is correct on the
 * day it changes without a rebuild.
 */
export function useToday(): string {
  return useSyncExternalStore(subscribe, clientDay, buildDay);
}
