import { bundleMDX } from "mdx-bundler";
import remarkGfm from "remark-gfm";
import path from "path";
export function mdxBundle({ source }: { source: string }) {
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "esbuild.exe",
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "bin",
      "esbuild",
    );
  }
  return bundleMDX({
    source,
    mdxOptions(options, frontmatter) {
      // options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      //   options.rehypePlugins = [...(options.rehypePlugins ?? []), myRehypePlugin]
      return options;
    },
  });
}
