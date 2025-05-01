import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { A, Blockquote, H1, H2, H3, P, Subtle } from "./components/typography";
import { Img } from "./components/media";
import { Ol, Ul } from "./components/lists";
import { Code } from "./components/code";
import { cn } from "~/lib/shadcn";

export function Markdown({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const Component = React.useMemo(() => getMDXComponent(source), [source]);
  return (
    <div
      className={cn(
        "prose dark:prose-invert mx-auto max-w-4xl rounded-md py-8",
        className,
      )}
      id="markdown-content"
    >
      <Component
        components={{
          h1: H1,
          h2: H2,
          h3: H3,
          p: P,
          a: A,
          blockquote: Blockquote,
          span: Subtle,
          code: Code,
          ol: Ol,
          ul: Ul,
          img: Img,
        }}
      />
    </div>
  );
}
