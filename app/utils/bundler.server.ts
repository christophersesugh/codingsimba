import { bundleMDX } from "mdx-bundler";
import remarkGfm from "remark-gfm";

import path from "path";

// const content = `Welcome to "Coding Simba," your gateway to the world of technology and
// coding! I'm Christopher A. Sesugh, the curator of this tech-savvy haven.
// With a passion for all things tech and a love for coding, I've embarked on
// a journey to share my insights, knowledge, and experiences with you.

// On this blog, you'll find a blend of tech-related topics, coding
// tutorials, and the latest updates from the digital realm. My goal is to
// demystify the world of technology and make it accessible to tech
// enthusiasts of all levels. Whether you're a seasoned coder or just dipping
// your toes into the tech waters, there's something here for everyone.

// I believe that technology has the power to transform our lives, and I'm
// dedicated to exploring the latest trends, discussing best practices, and
// providing you with practical advice to help you navigate the ever-evolving
// tech landscape. "Coding Simba" is not just a blog; it's a community of
// tech enthusiasts, and I'm thrilled to have you on board.

// Join me in this exciting journey of discovery, innovation, and
// problem-solving. Let's unravel the mysteries of the digital world
// together, one code at a time. Feel free to connect, share your thoughts,
// and embark on this tech adventure with me.

// Thank you for being a part of "Coding Simba Community". Together, we'll unlock the
// endless possibilities of the tech universe.

// # using the bundler
// `;

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
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      //   options.rehypePlugins = [...(options.rehypePlugins ?? []), myRehypePlugin]
      return options;
    },
  });
}
