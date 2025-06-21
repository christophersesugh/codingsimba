import { generateRobotsTxt } from "@nasa-gcn/remix-seo";
import { getDomainUrl } from "~/utils/misc";

export function loader({ request }: { request: Request }) {
  return generateRobotsTxt([
    { type: "sitemap", value: `${getDomainUrl(request)}/sitemap.xml` },
  ]);
}
