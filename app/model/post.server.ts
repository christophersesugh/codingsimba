import dashify from "dashify";
import matter from "gray-matter";
import NodeCache from "node-cache";
import { octokit } from "~/libs/octokit.server";

const cache = new NodeCache();
const { GITHUB_USERNAME, GITHUB_REPO } = process.env;
if (!GITHUB_USERNAME || !GITHUB_REPO) {
  throw new Error("GITHUB_USERNAME and GITHUB_REPO required.");
}

const owner: string = GITHUB_USERNAME;
const repo: string = GITHUB_REPO;
const path: string = "content/posts";
const postsCacheKey: string = "blogPosts";
const tagsCacheKey: string = "blogTags";
const cacheKeyPrefix: string = "blogPost_";
const ttl: number = 7 * 60 * 60;

/**
 * createPost - create a new post on github
 * @param {Object} formData
 * @returns {Object}
 */
async function createPost(formData: FormData): Promise<any> {
  const { fileContent, title, filePath } = await formatMDXContent(formData);
  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add a new blog post: ${title}`,
    content: Buffer.from(fileContent).toString("base64"),
  });
  return data;
}

async function updatePost(formData: FormData): Promise<any> {
  const { fileContent, title, filePath } = await formatMDXContent(formData);
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
 * getPosts - get all posts from github
 * @param {Object} request
 * @returns {Object}
 */
async function getPosts(request: any): Promise<any> {
  let url: URL | undefined;
  let postLimit: number = 9;
  let search: string | null = null;
  let tag: string | null = null;

  if (request) {
    url = new URL(request.url);
    if (url.pathname === "/") {
      postLimit = 3;
    } else {
      const reqLimit = parseInt(url.searchParams.get("postLimit") || "0");
      postLimit += reqLimit;
    }
    search = url.searchParams.get("search");
    tag = url.searchParams.get("tag");
  }

  const cachedData: { posts?: any[] } = cache.get(postsCacheKey) || {};
  if (Array.isArray(cachedData.posts)) {
    const { posts } = cachedData;

    if (search) {
      const filteredPosts = posts?.filter(
        (post: { data: { title: string | string[] } }) =>
          post.data.title.includes(search!),
      );

      const limitedPosts = limitPosts(filteredPosts, postLimit);
      return { posts: limitedPosts };
    }

    if (tag) {
      const tagFilteredPosts = posts?.filter(
        (post: { data: { tags: string | string[] } }) =>
          post.data.tags.includes(tag!),
      );

      const limitedPosts = limitPosts(tagFilteredPosts, postLimit);
      return { posts: limitedPosts };
    }

    const limitedPosts = limitPosts(posts, postLimit);
    return { posts: limitedPosts };
  }

  const response = await fetchAllFilesProps();
  const posts = await fetchAllPosts(response);

  cache.set(postsCacheKey, { posts }, ttl);
  if (search) {
    const filteredPosts = posts?.filter(
      (post: { data: { title: string | string[] } }) =>
        post.data.title.includes(search!),
    );

    const limitedPosts = limitPosts(filteredPosts, postLimit);
    return { posts: limitedPosts };
  }

  if (tag) {
    const tagFilteredPosts = posts?.filter(
      (post: { data: { tags: string | string[] } }) =>
        post.data.tags.includes(tag!),
    );

    const limitedPosts = limitPosts(tagFilteredPosts, postLimit);
    return { posts: limitedPosts };
  }
  const limitedPosts = limitPosts(posts, postLimit);
  return { posts: limitedPosts };
}

/**
 * getTags - get all tags from posts
 * @returns {Array} uniqueTags
 */
async function getTags(): Promise<string[]> {
  const cachedTags: string[] | undefined = cache.get(tagsCacheKey);
  if (cachedTags) {
    return cachedTags;
  }

  const response = await fetchAllFilesProps();
  const files = response.data?.filter(
    (file: any) => file.type === "file" && file.name.endsWith(".mdx"),
  );

  const allTags: string[] = [];

  for (const file of files) {
    const contentResponse = await fetchAllFilesProps(file.path);

    const postContent = Buffer.from(
      contentResponse.data.content,
      "base64",
    ).toString("utf-8");

    const { data } = matter(postContent);
    if (typeof data.tags === "string") {
      const tagsArray = data.tags.split(",");
      allTags.push(...tagsArray);
    }
  }

  const uniqueTags = Array.from(new Set(allTags));
  cache.set(tagsCacheKey, uniqueTags, ttl);
  return uniqueTags;
}

/**
 * getPost - get a single post from github
 * @param {Object} request
 * @returns {Object}
 */
async function getPost(request: any): Promise<any> {
  const cacheKey = `${cacheKeyPrefix}${request.params.slug}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const postPath = `${path}/${request.params.slug}.mdx`;
  const response = await fetchAllFilesProps(postPath);
  const postContent = Buffer.from(response.data.content, "base64").toString(
    "utf-8",
  );

  const { data, content } = matter(postContent);
  const relatedPosts = await fetchRelatedPosts(data);
  cache.set(cacheKey, { data, content, relatedPosts }, ttl);
  return { data, content, relatedPosts };
}

/**
 * deletePost - delete a post from github
 * @param {String} fileSlug
 * @returns {String}
 */
async function deletePost(fileSlug: string): Promise<any> {
  try {
    const response = await fetchAllFilesProps();
    const fileToDelete = response.find(
      (file: any) => file.type === "file" && file.name === fileSlug,
    );
    if (!fileToDelete) {
      throw new Error("File not found");
    }

    const deleteResponse = await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path: `${path}/${fileSlug}`,
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
  const published = false;

  const fileName = `${title
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/(\?)+$/, "")}.mdx`;

  const filePath = `${path}/${fileName}`;

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
 * fetchRelatedPosts - fetch related posts based on tags
 * @param {Object} postData
 * @returns {Array}
 */
async function fetchRelatedPosts(postData: any): Promise<any> {
  const currentPostTags = postData?.tags
    .split(",")
    .map((tag: string) => tag.trim());
  try {
    const allPostsResponse = await fetchAllFilesProps();
    const allPosts = await fetchAllPosts(allPostsResponse);

    const relatedPosts = allPosts?.filter((post: any) => {
      if (post.data.slug === postData.slug) {
        return false;
      }
      const postTags = post.data.tags
        .split(",")
        .map((tag: string) => tag.trim());
      return postTags.some((tag: any) => currentPostTags.includes(tag));
    });

    const limitedRelatedPosts = limitPosts(relatedPosts);
    return limitedRelatedPosts;
  } catch (error) {
    return error;
  }
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
      path: filePath ? filePath : path,
    });
    return allPostsResponse;
  } catch (error) {
    return error;
  }
}

/**
 * fetchAllPosts - fetch all posts from github
 * @param {Object} allPostsResponse
 * @returns {Object}
 */
async function fetchAllPosts(allPostsResponse: any): Promise<any> {
  try {
    const files = allPostsResponse?.data?.filter(
      (file: any) => file.type === "file" && file.name.endsWith(".mdx"),
    );
    const allPosts = await Promise.all(
      files.map(async (file: any) => {
        const contentResponse = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        const postContent = Buffer.from(
          contentResponse.data.content,
          "base64",
        ).toString("utf-8");
        const { data, content } = matter(postContent);
        return { data, content };
      }),
    );
    return allPosts;
  } catch (error) {
    return error;
  }
}

/**
 * limitPosts - limit the number of posts to be displayed
 * @param {Array} data
 * @param {Number} limit
 * @returns {Array}
 */
function limitPosts(data: any[], limit?: number): any[] {
  return data?.slice(0, limit ? limit : 3);
}

export { createPost, updatePost, getPosts, getTags, getPost, deletePost };
