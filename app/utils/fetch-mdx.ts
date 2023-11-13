import fs from "fs";
import path from "path";
import { mdxBundle } from "./bundler.server";

const mdxDirectory = path.join(process.cwd(), "content/posts");

export async function getPosts(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  let limit = 6;
  const searchTerm = searchParams.get("search");
  const tag = searchParams.get("tag");
  const postLimit = searchParams.get("postLimit");

  if (url.pathname === "/") {
    limit = 3;
  }

  if (postLimit) {
    const parsedLimit = parseInt(postLimit);
    if (!isNaN(parsedLimit)) {
      limit = parsedLimit;
    }
  }
  const posts = await fetchAllPosts();
  const allPosts = await Promise.all(posts);
  const filterByTitle = searchTerm
    ? allPosts.filter(
        (post) =>
          post.frontmatter.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          post.frontmatter.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    : allPosts;

  const filterByTag = tag
    ? filterByTitle.filter((post) =>
        post.frontmatter.tags.includes(tag.toLowerCase()),
      )
    : filterByTitle;

  const sortedPosts = filterByTag.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });

  return sortedPosts.slice(0, limit);
}

export async function getTags() {
  const posts = await fetchAllPosts();
  const allPosts = await Promise.all(posts);
  const allTags = allPosts
    .filter((post) => post.frontmatter.tags)
    .flatMap((post) =>
      post.frontmatter.tags.split(",").map((tag: string) => tag.trim()),
    );
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags;
}

async function fetchAllPosts() {
  const posts = fs
    .readdirSync(mdxDirectory, "utf-8")
    .filter((file) => file.endsWith(".mdx"))
    .map(async (file) => {
      const filePath = path.join(mdxDirectory, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { code, frontmatter } = await mdxBundle({ source: content });
      return { file, frontmatter, code };
    });
  return posts;
}

export async function getPost(slug: string) {
  try {
    const filePath = path.join(mdxDirectory, slug);
    const content = fs.readFileSync(filePath, "utf-8");
    const { code, frontmatter } = await mdxBundle({ source: content });
    const relatedPosts = await getRelatedPosts(
      frontmatter.tags,
      frontmatter.slug,
    );

    return { code, frontmatter, relatedPosts };
  } catch (error) {
    throw error;
  }
}

async function getRelatedPosts(tags: string[], currentSlug: string) {
  const files = fs.readdirSync(mdxDirectory, "utf-8");
  const relatedPosts = [];
  for (const file of files) {
    if (file.endsWith(".mdx")) {
      const content = fs.readFileSync(path.join(mdxDirectory, file), "utf-8");
      const { frontmatter, code } = await mdxBundle({ source: content });

      if (
        frontmatter.tags &&
        frontmatter.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .some((tag: string) => tags.includes(tag)) &&
        frontmatter.slug !== currentSlug
      ) {
        relatedPosts.push({ file, frontmatter, code });
      }
    }
  }

  return relatedPosts.slice(0, 3);
}
