import { buildPlaceholdUrl } from "./placehold";

// Quick smoke tests (not wired to test runner). Run using ts-node if needed.
console.log(buildPlaceholdUrl({ width: 600, height: 400 }));
console.log(buildPlaceholdUrl({ width: 300, format: "svg", background: "000", color: "fff", text: "Missing+Image" }));
