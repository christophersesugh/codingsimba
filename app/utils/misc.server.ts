import fs from "node:fs/promises";
import path from "node:path";
import TurndownService from "turndown";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { bundleMDX } from "./mdx.server";

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

        const { frontmatter, code } = await bundleMDX({
          source: content,
        });

        const slug = file.replace(/\.mdx$/, "");

        return {
          slug,
          frontmatter,
          content: code,
        };
      }),
    );

    return processedFiles.filter(Boolean);
    // .sort((a, b) => {
    //   if (a.date && b.date) {
    //     return new Date(b.date).getTime() - new Date(a.date).getTime();
    //   }
    //   return 0;
    // });
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
 * @returns {Record<string, string>} Object mapping file paths to their code content
 *
 * @example
 * ```ts
 * const components = [
 *   { file: { filename: "Button", code: "export const Button = () => <button>Click me</button>" } }
 * ];
 * const bundled = bundleComponents(components);
 * // Result: { "./Button.tsx": "export const WrappedButton = (props) => ..." }
 * ```
 */
export function bundleComponents(
  components: Array<{ file: { filename: string; code: string } }>,
): Record<string, string> {
  if (!components?.length) {
    return {};
  }

  return components.reduce<Record<string, string>>((acc, component) => {
    const componentName = component.file.filename
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    const fileKey = `./${component.file.filename}.tsx`;

    acc[fileKey] = `
    import React, { useState } from 'react';
    ${component.file.code}
    export default function Embedded(props) {
      return (
        <div className="mdx-embedded-wrapper">
            <${componentName} {...props} />
        </div>
      );
    }
    `;
    return acc;
  }, {});
}

const turndownService = new TurndownService({
  headingStyle: "atx", // Use # for headings
  bulletListMarker: "-", // Use - for lists
  codeBlockStyle: "fenced", // Use ``` for code blocks
});

marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
});

/**
 * Service for converting between Markdown and HTML formats.
 * Uses marked for Markdown to HTML conversion and Turndown for HTML to Markdown conversion.
 * Includes sanitization of input using DOMPurify.
 */
export class MarkdownConverter {
  /**
   * Converts Markdown to sanitized HTML.
   * @param markdown - The Markdown string to convert
   * @returns Promise<string> - The sanitized HTML output
   * @example
   * ```ts
   * const html = await MarkdownConverter.toHtml("# Hello World");
   * // Returns: "<h1>Hello World</h1>"
   * ```
   */
  static async toHtml(markdown: string) {
    return marked.parse(DOMPurify.sanitize(markdown));
  }

  /**
   * Converts HTML to Markdown format.
   * @param html - The HTML string to convert
   * @returns string - The Markdown output
   * @example
   * ```ts
   * const markdown = MarkdownConverter.toMarkdown("<h1>Hello World</h1>");
   * // Returns: "# Hello World"
   * ```
   */
  static toMarkdown(html: string) {
    return turndownService.turndown(html);
  }
}
