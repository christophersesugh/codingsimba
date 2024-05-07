import { fetchAllPosts } from "~/utils/blog.server";

export function toXmlSitemap(urls: string[]) {
  const urlsAsXml = urls
    .map((url) => {
      if (url.includes("/blog/")) {
        return `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toUTCString()}</lastmod>
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

export async function getPostsSlug() {
  const posts = await fetchAllPosts();
  const allPosts = await Promise.all(posts);
  return allPosts;
}
