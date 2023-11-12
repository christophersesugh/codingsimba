import fs from "fs";
import path from "path";
import { mdxBundle } from "./bundler.server";

const mdxDirectory = path.join(process.cwd(), "content/posts");

// Function to read MDX files from a directory
export const getMdxFiles = async () => {
  const files = fs
    .readdirSync(mdxDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map(async (file) => {
      const filePath = path.join(mdxDirectory, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { code, frontmatter } = await mdxBundle({ source: content });
      return { file, frontmatter, code };
    });

  return Promise.all(files);
};

export const fetchMdxContentBySlug = async (slug: string) => {
  try {
    const filePath = path.join(mdxDirectory, slug);
    const content = fs.readFileSync(filePath, "utf-8");
    const { code, frontmatter } = await mdxBundle({ source: content });
    return { code, frontmatter };
  } catch (error) {
    throw error;
  }
};
