/// <reference types="@vitest/browser/providers/playwright" />
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      name: "unit",
      environment: "node",
      setupFiles: ["./tests/setup/setup-env.unit.ts"],
      include: ["**/*.unit.{test,spec}.{ts,tsx}"],
      exclude: ["**/*.browser.{test,spec}.{ts,tsx}"],
    },
  },
  {
    extends: "vite.config.ts",
    test: {
      name: "browser",
      browser: {
        enabled: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
      setupFiles: ["./tests/setup/setup-env.browser.ts"],
      include: ["**/*.browser.{test,spec}.{ts,tsx}"],
      exclude: ["**/*.unit.{test,spec}.{ts,tsx}"],
    },
  },
]);
