import fs from "node:fs/promises";
import path from "node:path";
import { bundleMDX } from "./mdx.server";
import type { Comment } from "~/generated/prisma";
import { prisma } from "./db.server";
import type { IComment } from "~/components/comment";

/**
 * Determines permissions for comments and replies
 * @param userId - The ID of the user to check permissions for
 * @param entityArray - Array of comments or replies to check permissions for
 * @returns Array of permission objects containing commentId, isOwner, and permissions array
 * @description Checks both ownership and role-based permissions for each entity.
 * For owners, checks both OWN and ANY access types.
 * For non-owners, only checks ANY access type.
 * Returns an array of permission objects with:
 * - commentId: The ID of the comment/reply
 * - isOwner: Whether the user owns the entity
 * - permissions: Array of permission objects with action and hasPermission
 */
export async function determineCommentPermissions(
  userId: string,
  entityArray: (Comment | IComment)[],
) {
  if (!userId || !entityArray?.length) {
    return [];
  }
  return Promise.all(
    entityArray.map(async (item) => {
      const isOwner = item.authorId === userId;
      const permissions = await prisma.permission.findMany({
        select: { id: true, action: true },
        where: {
          roles: { some: { users: { some: { id: userId } } } },
          entity: "COMMENT",
          action: {
            in: ["CREATE", "READ", "UPDATE", "DELETE"],
          },
          access: isOwner ? "OWN" : "ANY",
        },
      });
      return {
        commentId: item.id,
        isOwner,
        permissions: permissions.map((p) => ({
          action: p.action,
          hasPermission: true,
        })),
      };
    }),
  );
}

/**
 * Reads the raw content of a specific MDX page from the content/pages directory.
 *
 * @param {string} pageName - Name of the page without the .mdx extension
 * @returns {Promise<string | null>} The raw content of the page or null if not found
 * @throws {Error} If there's an error reading the file
 *
 * @example
 * ```ts
 * const content = await readPageContent("about");
 * if (content) {
 *   console.log(content); // Raw MDX content
 * }
 * ```
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
 * Reads and processes a specific MDX page content using bundleMDX.
 * This function combines reading the raw content and bundling it into a processed format.
 *
 * @param {string} pageName - Name of the page without the .mdx extension
 * @returns {Promise<{ code: string; frontmatter: Record<string, any> } | null>}
 *   Processed MDX content with code and frontmatter, or null if not found
 *
 * @example
 * ```ts
 * const processed = await readMdxPageContent("about");
 * if (processed) {
 *   console.log(processed.code); // Processed content
 *   console.log(processed.frontmatter); // Page metadata
 * }
 * ```
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
 * Reads and processes all MDX files in a specified directory.
 * Each file is processed to extract content, metadata, and frontmatter.
 * Results are sorted by date in descending order.
 *
 * @param {string} directory - Path to the directory containing MDX files (relative to content/pages)
 * @returns {Promise<Array<{
 *   slug: string;
 *   content: string;
 *   frontmatter: Record<string, any>;
 *   title: string;
 *   date: string;
 *   description: string;
 * }>>} Array of processed MDX files with their metadata
 *
 * @example
 * ```ts
 * const posts = await readMdxDirectory("blog");
 * posts.forEach(post => {
 *   console.log(post.title);
 *   console.log(post.date);
 *   console.log(post.content);
 * });
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
          title: processed.frontmatter.title,
          date: processed.frontmatter.date,
          description: processed.frontmatter.description,
        };
      }),
    );

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

/**
 * Bundles React components into a format suitable for MDX bundling.
 * Transforms an array of component objects into a record of file paths and their code content.
 *
 * @param {Array<{ file: { filename: string; code: string } }>} components - Array of component objects
 * @returns {Promise<Record<string, string>>} Object mapping file paths to their code content
 *
 * @example
 * ```ts
 * const components = [
 *   { file: { filename: "Button", code: "export const Button = () => <button>Click me</button>" } }
 * ];
 * const bundled = await bundleComponent(components);
 * // Result: { "./Button.tsx": "export const Button = () => <button>Click me</button>" }
 * ```
 */
export function bundleComponents(
  components: Array<{ file: { filename: string; code: string } }>,
) {
  if (!components?.length) {
    return;
  }
  return (
    components.reduce<Record<string, string>>((acc, component) => {
      acc[`./${component.file.filename}.tsx`] = component.file.code;
      return acc;
    }, {}) ?? {}
  );
}
