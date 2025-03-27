/// <reference types="@vitest/browser/providers/playwright" />
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      name: "unit",
      environment: "node",
      setupFiles: ["./tests/setup-tests.ts"],
      include: ["**/__tests__/unit/**/*.{test,spec}.ts"],
      exclude: [
        "**/__tests__/browser/**/*.{test,spec}.{ts,tsx}",
        "**/tests/e2e/**/*.{test,spec}.{ts,tsx}",
      ],
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
      setupFiles: ["./tests/setup-tests.ts"],
      include: ["**/__tests__/browser/**/*.{test,spec}.{ts,tsx}"],
      exclude: [
        "**/__tests__/unit/**/*.{test,spec}.{ts,tsx}",
        "**/tests/e2e/**/*.{test,spec}.{ts,tsx}",
      ],
    },
  },
]);
