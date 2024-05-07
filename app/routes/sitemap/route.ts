import { navItems } from "~/components/nav-bar";
import { getPostsSlug, toXmlSitemap } from "./utils";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { metaFn } from "~/utils/meta";

export const meta: MetaFunction = metaFn;

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const BASE_URL = new URL(request.url).origin;
    const posts = await getPostsSlug();

    const sitemap = toXmlSitemap([
      `${BASE_URL}/*`,
      ...navItems
        .filter(({ link }) => link !== "/")
        .map(({ link }) => `${BASE_URL}${link}`),
      ...posts.map((post) => `${BASE_URL}/blog/${post.data.slug}`),
    ]);

    console.log(sitemap);

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    throw new Response("Internal Server Error", { status: 500 });
  }
}
