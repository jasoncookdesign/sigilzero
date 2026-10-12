import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Test doubles for Next's router and DOM APIs are typed loosely on purpose.
    files: ["**/*.test.{ts,tsx}", "e2e/**"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  {
    // Node scripts run directly by `node` as CommonJS.
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    // React Compiler rule new in eslint-config-next 16. Both catalogs
    // initialise their filters from the URL in an effect; moving that into
    // state initialisers is a refactor, so this warns until it's done.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "docs/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
