import fs from "node:fs/promises";
import path from "node:path";
import { bundleMDX } from "./mdx.server";

/**
 * Reads the content of a specific MDX page.
 *
 * @param pageName - Name of the page without extension
 * @returns The raw content of the page or null if not found
 */
export async function readPageContent(
  pageName: string,
): Promise<string | null> {
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), "content/pages", `${pageName}.mdx`),
      "utf-8",
    );
    if (!data) return null;
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Reads and processes a specific MDX page content.
 *
 * @param pageName - Name of the page without extension
 * @returns Processed MDX content or null if not found
 */
export async function readMdxPageContent(pageName: string) {
  try {
    const data = await readPageContent(pageName);
    if (!data) return null;
    return await bundleMDX({ source: data });
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Reads and processes all MDX files in a directory.
 * Each file is processed and returned with its metadata and content.
 *
 * @param directory - Path to the directory containing MDX files
 * @returns Array of processed MDX files with their metadata and content
 *
 * @example
 * ```ts
 * const posts = await readMdxDirectory("content/posts");
 * // Returns: [
 * //   {
 * //     slug: "post-1",
 * //     title: "Post 1",
 * //     date: "2024-01-01",
 * //     content: "...",
 * //     frontmatter: { ... }
 * //   },
 * //   ...
 * // ]
 * ```
 */
export async function readMdxDirectory(directory: string) {
  try {
    const fullPath = path.join(process.cwd(), "content/pages", directory);
    const files = await fs.readdir(fullPath);

    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const processedFiles = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(fullPath, file);
        const content = await fs.readFile(filePath, "utf-8");

        if (!content) return null;

        const processed = await bundleMDX({
          source: content,
        });

        const slug = file.replace(/\.mdx$/, "");

        return {
          slug,
          content: processed.code,
          frontmatter: processed.frontmatter,
          // Extract common metadata fields
          title: processed.frontmatter.title,
          date: processed.frontmatter.date,
          description: processed.frontmatter.description,
          // Add any other metadata fields you need
        };
      }),
    );

    // Filter out any null results and sort by date if available
    return processedFiles
      .filter((file): file is NonNullable<typeof file> => file !== null)
      .sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
  } catch (error) {
    console.error(`Error reading MDX directory ${directory}:`, error);
    return [];
  }
}
