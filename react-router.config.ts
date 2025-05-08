import type { Config } from "@react-router/dev/config";
import { navLinks, legal } from "./app/constants/navlinks";

const prerenderedRoutes = [
  "/",
  "/not-found",
  "*",
  ...[...navLinks, ...legal].map((link) => `/${link.path}`),
];

export default {
  ssr: true,
  prerender: [...new Set(prerenderedRoutes)],
} satisfies Config;
