import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentPath = "content/posts";
const mdxDirectory = path.join(process.cwd(), contentPath);

/**
 * getPosts - fetch all posts from content directory
 * @param {Object} request
 * @returns all posts
 */
export async function getPosts(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  let limit = 9;
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
    ? allPosts?.filter(
        (post) =>
          post.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.data.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    : allPosts;

  const filterByTag = tag
    ? filterByTitle.filter((post) => post.data.tags.includes(tag.toLowerCase()))
    : filterByTitle;

  const sortedPosts = filterByTag.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });
  if (url.pathname === "/blog" || url.pathname === "/") {
    return sortedPosts.filter((post) => post.data.published).slice(0, limit);
  }

  return sortedPosts.slice(0, limit);
}

/**
 * getTags - fetch all  tags from content directory
 * @returns unique tags
 */
export async function getTags() {
  const posts = await fetchAllPosts();
  const allPosts = await Promise.all(posts);
  const allTags = allPosts
    .filter((post) => post.data.tags && post.data.published)
    .flatMap((post) =>
      post.data.tags.split(",").map((tag: string) => tag.trim()),
    );
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags;
}

/**
 * getPost - fetch a single post from content directory
 * @param {String} slug
 * @returns content or error if any
 */
export async function getPost(slug: unknown) {
  const filePath = path.join(mdxDirectory, slug + ".mdx");
  const mdxContent = fs.readFileSync(filePath, "utf-8");
  if (!mdxContent) {
    throw new Error("Post not found");
  }
  const { data, content } = matter(mdxContent);
  return { data, content };
}

/**
 * getRelatedPosts - fetch related posts to a given post from content/post directory
 * @param {String} tags
 * @param {String} currentSlug
 * @returns
 */
export async function getRelatedPosts(tags: string[], currentSlug: string) {
  const files = fs.readdirSync(mdxDirectory, "utf-8");
  const relatedPosts = [];
  for (const file of files) {
    if (file.endsWith(".mdx")) {
      const mdxContent = fs.readFileSync(
        path.join(mdxDirectory, file),
        "utf-8",
      );
      const { data, content } = matter(mdxContent);

      if (
        data.tags &&
        data.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .some((tag: string) => tags.includes(tag)) &&
        data.slug !== currentSlug
      ) {
        relatedPosts.push({ file, data, content });
      }
    }
  }

  return relatedPosts.slice(0, 3).filter((post) => post.data.published);
}

/**==================
 * UTILITY FUNCTIONS
 =====================*/

async function fetchAllPosts() {
  const posts = fs
    .readdirSync(mdxDirectory, "utf-8")
    .filter((file) => file?.endsWith(".mdx"))
    .map(async (file) => {
      const filePath = path.join(mdxDirectory, file);
      const mdxContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(mdxContent);
      return { file, data, content };
    });

  if (!posts) {
    throw new Error("No posts found");
  }
  return posts;
}
