import { reactRouter } from "@react-router/dev/vite";
// import { reactRouterDevTools } from "react-router-devtools";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const MODE = process.env.NODE_ENV;

export default defineConfig({
  build: {
    cssMinify: MODE === "production",
    sourcemap: true,
  },
  plugins: [
    // reactRouterDevTools({}),
    tailwindcss(),
    ...(process.env.VITEST ? [] : [reactRouter()]),
    tsconfigPaths(),
  ],
});
