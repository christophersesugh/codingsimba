import dashify from "dashify";
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
  console.log(fileContent, title, filePath);

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

/**
 * limitPosts - limit the number of posts to be displayed
 * @param {Array} data
 * @param {Number} limit
 * @returns {Array}
 */
function limitPosts(data: any[], limit?: number): any[] {
  return data?.slice(0, limit ? limit : 3);
}

export { createPost, updatePost, deletePost };
