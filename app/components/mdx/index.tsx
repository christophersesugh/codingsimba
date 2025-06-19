import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";
import {
  A,
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  H6,
  H5,
  Hr,
  P,
  Subtle,
  Pre,
  Div,
} from "./components/typography";
import { Img } from "./components/media";
import { Ol, Ul } from "./components/lists";
import { Code } from "./components/code";
import { cn } from "~/lib/shadcn";
import type { SandpackTemplate } from "~/utils/content.server/articles/types";
import {
  Caption,
  Table,
  Tbody,
  Th,
  Thead,
  Td,
  Tr,
  Tfoot,
} from "./components/table";

export function Markdown({
  source,
  sandpackTemplates,
  className,
}: {
  source: string;
  className?: string;
  sandpackTemplates?: SandpackTemplate[];
}) {
  const Component = React.useMemo(() => getMDXComponent(source), [source]);

  const CodeWithSandpack = React.useCallback(
    (props: React.ComponentProps<typeof Code>) => (
      <Code sandpackTemplates={sandpackTemplates} {...props} />
    ),
    [sandpackTemplates],
  );
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
          h4: H4,
          h5: H5,
          h6: H6,
          p: P,
          div: Div,
          a: A,
          pre: Pre,
          blockquote: Blockquote,
          span: Subtle,
          code: CodeWithSandpack,
          ol: Ol,
          ul: Ul,
          img: Img,
          hr: Hr,
          table: Table,
          thead: Thead,
          tbody: Tbody,
          tfoot: Tfoot,
          caption: Caption,
          tr: Tr,
          th: Th,
          td: Td,
        }}
      />
    </div>
  );
}
