import fs from "fs";
import path from "path";
import dashify from "dashify";
// import NodeCache from "node-cache";
import { octokit } from "~/libs/octokit.server";
import matter from "gray-matter";
// import { mdxBundle } from "~/utils/bundler.server";

// const cache = new NodeCache();
const { GITHUB_USERNAME, GITHUB_REPO } = process.env;
if (!GITHUB_USERNAME || !GITHUB_REPO) {
  throw new Error("GITHUB_USERNAME and GITHUB_REPO required.");
}

const owner: string = GITHUB_USERNAME;
const repo: string = GITHUB_REPO;
const contentPath: string = "content/posts";
// const postsCacheKey: string = "blogPosts";
// const tagsCacheKey: string = "blogTags";
// const cacheKeyPrefix: string = "blogPost_";
// const ttl: number = 7 * 60 * 60;

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
export async function getPost(slug: string) {
  try {
    const filePath = path.join(mdxDirectory, slug + ".mdx");
    const mdxContent = fs.readFileSync(filePath, "utf-8");
    if (!mdxContent) {
      throw new Error("Post not found");
    }
    const { data, content } = matter(mdxContent);
    return { data, content };
  } catch (error) {
    throw error;
  }
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
      // const { data, code } = await mdxBundle({ source: mdxContent });
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

/**
 * createPost - create a new post on github
 * @param {Object} formData
 * @returns {Object}
 */
export async function createPost(formData: FormData): Promise<any> {
  const { fileContent, title, filePath } = formatMDXContent(formData);
  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add a new blog post: ${title}`,
    content: Buffer.from(fileContent).toString("base64"),
  });
  return data;
}

/**
 * updatePost - update a post on github
 * @param {Object} formData
 * @returns post data
 */
export async function updatePost(formData: FormData): Promise<any> {
  const { fileContent, title, filePath } = formatMDXContent(formData);
  const existingFileContent = await fetchAllFilesProps(filePath);

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Update blog post: ${title}`,
    content: Buffer.from(fileContent).toString("base64"),
    sha: existingFileContent.data.sha,
  });
  return data;
}

/**
 * deletePost - delete a post from github
 * @param {String} fileSlug
 * @returns {String}
 */
export async function deletePost(fileSlug: FormDataEntryValue): Promise<any> {
  try {
    const response = await fetchAllFilesProps();

    const fileToDelete = response.data.find(
      (file: any) => file.type === "file" && file.name === fileSlug + ".mdx",
    );

    if (!fileToDelete) {
      throw new Error("File not found");
    }

    const deleteResponse = await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path: `${contentPath}/${fileSlug}.mdx`,
      message: `Delete blog post: ${fileSlug}`,
      sha: fileToDelete.sha,
    });

    return deleteResponse;
  } catch (error) {
    return error;
  }
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
      // const { code, data } = await mdxBundle({ source: content });
      const { data, content } = matter(mdxContent);
      return { file, data, content };
    });

  if (!posts) {
    throw new Error("No posts found");
  }
  return posts;
}

/**
 * formatMDXContent - takes formData and format MDX content to be created on github
 * @param {Object} formData
 * @returns {Object} formated fileContent and filePath
 */
function formatMDXContent(formData: FormData): {
  fileContent: string;
  title: string;
  filePath: string;
} {
  const title = formData.get("postTitle") as string;
  const slug = dashify(title);
  const tags = formData.get("postTags") as string;
  const photo = formData.get("postPhoto") as string;
  const description = formData.get("postDescription") as string;
  const video = formData.get("postVideo") as string;
  const createdAt = Date.now();
  const content = formData.get("postContent") as string;
  const published = Boolean(formData.get("postPublished")) as boolean;

  const fileName = `${title
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/(\?)+$/, "")}.mdx`;

  const filePath = `${contentPath}/${fileName}`;

  const fileContent = `---
  title: ${title}
  slug: ${slug}
  tags: ${tags}
  photo: ${photo}
  description: ${description}
  video: ${video}
  createdAt: ${createdAt}
  published: ${published} 
---

${content}
`;
  return { fileContent, title, filePath };
}

/**
 * fetchAllFilesProps - fetch all files from github
 * @param {String} filePath
 * @returns {Object}
 */
async function fetchAllFilesProps(filePath?: string): Promise<any> {
  try {
    const allPostsResponse = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath ? filePath : contentPath,
    });
    return allPostsResponse;
  } catch (error) {
    return error;
  }
}
