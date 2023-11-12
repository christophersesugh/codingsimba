import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BlockQuote,
  CodeBlock,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Img,
  MdLink,
  OL,
  UL,
} from "./markdown-components";

export function Markdown({ source }: { source: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        children={source}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H4,
          h5: H5,
          h6: H6,
          ul: UL,
          ol: OL,
          a: MdLink,
          img: Img,
          code: CodeBlock,
          blockquote: BlockQuote,
        }}
      />
    </div>
  );
}
