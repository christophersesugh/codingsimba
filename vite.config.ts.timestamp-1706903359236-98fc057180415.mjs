// vite.config.ts
import {
  unstable_vitePlugin as remix,
  unstable_cloudflarePreset as cloudflare
} from "file:///Users/codingsimba/Desktop/projects/codingsimba/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/codingsimba/Desktop/projects/codingsimba/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/codingsimba/Desktop/projects/codingsimba/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [remix({ presets: [cloudflare()] }), tsconfigPaths()],
  ssr: {
    resolve: {
      externalConditions: ["workerd", "worker"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY29kaW5nc2ltYmEvRGVza3RvcC9wcm9qZWN0cy9jb2RpbmdzaW1iYVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2NvZGluZ3NpbWJhL0Rlc2t0b3AvcHJvamVjdHMvY29kaW5nc2ltYmEvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2NvZGluZ3NpbWJhL0Rlc2t0b3AvcHJvamVjdHMvY29kaW5nc2ltYmEvdml0ZS5jb25maWcudHNcIjtpbXBvcnQge1xuICB1bnN0YWJsZV92aXRlUGx1Z2luIGFzIHJlbWl4LFxuICB1bnN0YWJsZV9jbG91ZGZsYXJlUHJlc2V0IGFzIGNsb3VkZmxhcmUsXG59IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZW1peCh7IHByZXNldHM6IFtjbG91ZGZsYXJlKCldIH0pLCB0c2NvbmZpZ1BhdGhzKCldLFxuICBzc3I6IHtcbiAgICByZXNvbHZlOiB7XG4gICAgICBleHRlcm5hbENvbmRpdGlvbnM6IFtcIndvcmtlcmRcIiwgXCJ3b3JrZXJcIl0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVDtBQUFBLEVBQzdULHVCQUF1QjtBQUFBLEVBQ3ZCLDZCQUE2QjtBQUFBLE9BQ3hCO0FBQ1AsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQztBQUFBLEVBQzdELEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLG9CQUFvQixDQUFDLFdBQVcsUUFBUTtBQUFBLElBQzFDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
