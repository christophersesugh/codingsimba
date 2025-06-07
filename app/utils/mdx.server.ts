/**
 * MDX Server Utilities
 *
 * This module provides utilities for processing and bundling MDX content with enhanced features
 * including math rendering, GitHub Flavored Markdown, and custom containers.
 *
 * Dependencies:
 * - mdx-bundler: Core MDX bundling functionality
 * - react-shiki: Code block syntax highlighting
 * - remark-gfm: GitHub Flavored Markdown support
 * - remark-math: Math equation support
 * - rehype-mathjax: Math equation rendering
 * - rehype-slug: Heading ID generation
 * - remark-flexible-containers: Custom container syntax
 */

import { bundleMDX as bMDX } from "mdx-bundler";
import { rehypeInlineCodeProperty } from "react-shiki";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import rehypeSlug from "rehype-slug";
import remarkContainers from "remark-flexible-containers";

/**
 * Bundles MDX source code into a single JavaScript module with enhanced features.
 *
 * This function processes MDX content using mdx-bundler and includes several plugins:
 * - remarkGfm: Adds GitHub Flavored Markdown support
 * - remarkContainers: Enables custom container syntax
 * - rehypeSlug: Adds IDs to headings for anchor links
 * - rehypeInlineCodeProperty: Enhances code block styling
 *
 * @param {Object} params - The parameters object
 * @param {string} params.source - The MDX source code to bundle
 * @param {Record<string, string>} [params.files] - Additional files to include in the bundle
 * @returns {Promise<{ code: string; frontmatter: Record<string, any> }>} An object containing:
 *   - code: The bundled JavaScript code
 *   - frontmatter: The extracted frontmatter data
 *
 * @example
 * ```ts
 * const { code, frontmatter } = await bundleMDX({
 *   source: "# Hello World\n\nThis is MDX content",
 *   files: {
 *     "components/Button.tsx": "export const Button = () => <button>Click me</button>"
 *   }
 * });
 * ```
 */
export async function bundleMDX({
  source,
  files,
}: {
  source: string;
  files?: Record<string, string>;
}) {
  return bMDX({
    source,
    files,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkMath,
        remarkContainers,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeMathjax,
        rehypeInlineCodeProperty,
      ];
      return options;
    },
  });
}
