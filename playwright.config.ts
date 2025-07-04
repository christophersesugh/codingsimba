import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const PORT = process.env.PORT || "5173";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120 * 1000, // 15 seconds should be enough but because of cold starts
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: process.env.CI ? "npm run start:mocks" : "npm run dev",
    port: Number(PORT),
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      PORT,
      NODE_ENV: "test",
    },
  },
});
