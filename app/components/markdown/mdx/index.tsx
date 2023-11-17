import React from "react";
import { getMDXComponent } from "mdx-bundler/client/index.js";
import {
  B,
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
  P,
  Strong,
  UL,
} from "./mdx-components";

export function Markdown({ source }: { source: string }) {
  const Component = React.useMemo(() => getMDXComponent(source), [source]);
  return (
    <>
      <Component
        components={{
          p: P,
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H4,
          h5: H5,
          h6: H6,
          ol: OL,
          ul: UL,
          a: MdLink,
          b: B,
          blockquote: BlockQuote,
          strong: Strong,
          img: Img,
          code: CodeBlock,
        }}
      />
    </>
  );
}
