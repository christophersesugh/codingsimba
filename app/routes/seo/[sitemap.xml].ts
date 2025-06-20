import { generateSitemap } from "@nasa-gcn/remix-seo";
import { type ServerBuild } from "react-router";
import { getDomainUrl } from "~/utils/misc";
import { type Route } from "./+types/[sitemap.xml]";

export async function loader({ request, context }: Route.LoaderArgs) {
  const serverBuild = (await context.serverBuild) as { build: ServerBuild };

  return generateSitemap(request, serverBuild.build.routes, {
    siteUrl: getDomainUrl(request),
    headers: {
      "Cache-Control": `public, max-age=${60 * 5}`,
    },
  });
}
