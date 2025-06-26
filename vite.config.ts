import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { reactRouterDevTools } from "react-router-devtools";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const MODE = process.env.NODE_ENV;

export default defineConfig({
  build: {
    target: "es2022",
    cssMinify: MODE === "production",
    rollupOptions: {
      external: [/node:.*/],
    },
    sourcemap: true,
  },
  server: {
    watch: { ignored: ["**/playwright-report/**"] },
  },
  plugins: [
    reactRouterDevTools({}),
    tailwindcss(),
    process.env.VITEST ? null : reactRouter(),
    tsconfigPaths(),
  ],
  test: {
    exclude: ["**/tests/e2e/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["html"],
      include: ["**/app/**"],
      exclude: ["**/app/generated/**", "**/.react-router/**"],
    },
  },
});
