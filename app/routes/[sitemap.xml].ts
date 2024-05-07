import { navItems } from "~/components/nav-bar";
import { fetchAllPosts } from "~/utils/blog.server";
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

function toXmlSitemap(urls: string[]) {
  const urlsAsXml = urls
    .map((url) => {
      if (url.includes("/blog/")) {
        return `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>`;
      } else {
        return `
      <url>
        <loc>${url}</loc>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
      </url>`;
      }
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"

  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${urlsAsXml}
</urlset>`;
}

async function getPostsSlug() {
  const posts = await fetchAllPosts();
  const allPosts = await Promise.all(posts);
  return allPosts;
}
