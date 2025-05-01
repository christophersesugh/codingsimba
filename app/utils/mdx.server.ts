import { bundleMDX as bMDX } from "mdx-bundler";
import { rehypeInlineCodeProperty } from "react-shiki";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/**
 * Bundles MDX source code into a single JavaScript module.
 * It uses `mdx-bundler` to process the MDX content and includes
 * plugins for remark and rehype to enhance the output.
 * @param param0.source - The source code to bundle.
 * @returns {Promise<{ code: string; frontmatter: Record<string, any> }>} - The bundled code and frontmatter.
 * @example
 * ```ts
 * const { code, frontmatter } = await bundleMDX({ source: mdxSource });
 * // code: The bundled JavaScript code.
 * // frontmatter: The frontmatter extracted from the MDX source.
 * ```
 */
export async function bundleMDX({ source }: { source: string }) {
  return bMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeInlineCodeProperty,
      ];
      return options;
    },
  });
}
