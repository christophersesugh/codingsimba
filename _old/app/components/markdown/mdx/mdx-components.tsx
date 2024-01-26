import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { Link } from "@remix-run/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from "clsx";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "~/components/ui/button";

type ElemProps = {
  children?: React.ReactNode;
};

export function P(props: ElemProps): React.ReactElement {
  if (
    React.isValidElement(props.children) &&
    typeof props.children.type === "string" &&
    props.children.type === "img"
  ) {
    return <>{props.children}</>;
  }
  return <p {...props} />;
}

export function H1(props: ElemProps): React.ReactElement {
  return (
    <h1
      className="text-3xl mt-5 mb-4 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    />
  );
}

export function H2(props: ElemProps): React.ReactElement {
  return (
    <h2
      className="text-2xl mt-4 mb-3 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    />
  );
}
export function H3(props: ElemProps): React.ReactElement {
  return (
    <h3
      className="text-xl mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    />
  );
}

export function H4(props: ElemProps): React.ReactElement {
  return (
    <h4
      className="text-lg mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    />
  );
}

export function H5(props: ElemProps): React.ReactElement {
  return (
    <h4
      className="text-lg mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    />
  );
}

export function H6(props: ElemProps): React.ReactElement {
  return (
    <h4
      className="text-lg mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    />
  );
}

export function UL(props: ElemProps): React.ReactElement {
  return <ul className="list-disc list-inside space-y-3 text-lg" {...props} />;
}

export function OL(props: ElemProps): React.ReactElement {
  return (
    <ol className="list-decimal list-inside space-y-3 text-lg" {...props} />
  );
}

export function BlockQuote(props: ElemProps): React.ReactElement {
  return (
    <blockquote
      className=" bg-blue-200 border-l-8 border-blue-500 text-black p-4 my-6 rounded-md"
      {...props}
    >
      <BsInfoCircle title="Info" className="w-6 h-6 inline mb-2" />
      {props.children}
    </blockquote>
  );
}

export function Strong(props: ElemProps): React.ReactElement {
  return (
    <strong className="font-black text-black dark:text-white" {...props} />
  );
}

export function B(props: ElemProps): React.ReactElement {
  return <b className="font-bold text-black dark:text-white" {...props} />;
}

export function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className="my-6 rounded-sm mx-auto" {...props} alt={props.alt} />;
}

// interface LinkProps {
//   href: string;
//   target?: "_blank" | "_self" | "_parent" | "_top" | string;
//   rel?: string;
//   prefetch?: "intent" | "none";
//   children?: React.ReactNode;
// }

export function MdLink(props: any): React.ReactElement {
  return (
    <Link
      to={props.href}
      target="_blank"
      prefetch="intent"
      className="text-blue-700"
      {...props}
    >
      {props.children}
    </Link>
  );
}

// type CodeBlockProps = {
//   node: React.ReactElement;
//   inline?: boolean;
//   className?: string;
//   children?: React.ReactNode;
// };

export function CodeBlock(props: any): React.ReactElement {
  const [copied, setCopied] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { node, inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || "");

  const customStyle = {
    fontSize: "1.2rem",
    lineHeight: "1.5",
    borderRadius: "8px",
    padding: "20px",
  };

  function handleCopied() {
    window.navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return !inline && match ? (
    <div className="bg-grey-700 relative my-4">
      <div className="absolute right-2 top-2">
        <Button
          className="text-slate-300"
          variant="ghost"
          onClick={handleCopied}
        >
          {copied ? (
            <>
              <IoCheckmarkDone className="mr-2 h-4 w-4" /> Copied!
            </>
          ) : (
            <>
              <MdOutlineContentCopy className="mr-2 h-4 w-4" /> Copy
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        {...props}
        children={String(children).replace(/\n$/, "")}
        customStyle={customStyle}
        style={nightOwl}
        showLineNumbers
        wrapLongLines
        language={match[1]}
        PreTag="div"
      />
    </div>
  ) : (
    <code
      {...props}
      className={clsx(
        "rounded-sm px-1 bg-slate-200 dark:bg-slate-500 dark:text-white text-lg",
        className,
      )}
    >
      {children}
    </code>
  );
}