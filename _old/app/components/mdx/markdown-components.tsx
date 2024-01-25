import { Link } from "@remix-run/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from "clsx";

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: any) {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      {...props}
      children={String(children).replace(/\n$/, "")}
      style={nightOwl}
      showLineNumbers
      language={match[1]}
      PreTag="div"
    />
  ) : (
    <code
      {...props}
      className={clsx("rounded-sm px-1 bg-slate-300", className)}
    >
      {children}
    </code>
  );
}

export function H1({ node, children, ...props }: any) {
  return (
    <h1 className="text-3xl mt-5 mb-4 capitalize text-amber-700" {...props}>
      {children}
    </h1>
  );
}
export function H2({ node, children, ...props }: any) {
  return (
    <h2 className="text-2xl mt-4 mb-3 capitalize text-amber-700" {...props}>
      {children}
    </h2>
  );
}
export function H3({ node, children, ...props }: any) {
  return (
    <h3 className="text-xl mt-3 mb-2 capitalize text-amber-700" {...props}>
      {children}
    </h3>
  );
}

export function H4({ node, children, ...props }: any) {
  return (
    <h4 className="text-lg mt-3 mb-2 capitalize" {...props}>
      {children}
    </h4>
  );
}

export function H5({ node, children, ...props }: any) {
  return (
    <h4 className="text-lg mt-3 mb-2 capitalize text-amber-700" {...props}>
      {children}
    </h4>
  );
}

export function H6({ node, children, ...props }: any) {
  return (
    <h4 className="text-lg mt-3 mb-2 capitalize text-amber-700" {...props}>
      {children}
    </h4>
  );
}

export function UL({ node, children, ...props }: any) {
  return (
    <ul className="list-disc space-y-4" {...props}>
      {children}
    </ul>
  );
}
export function OL({ node, children, ...props }: any) {
  return (
    <ol className="list-decimal space-y-4" {...props}>
      {children}
    </ol>
  );
}

export function BlockQuote({ node, children, ...props }: any) {
  return (
    <blockquote
      className="bg-blue-200 border-l-8 border-blue-500 text-black p-2 my-6 rounded-md"
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function Img({ node, children, ...props }: any) {
  return (
    <img
      // src={props.src}
      // alt={props.alt}
      // height={props.height}
      // width={props.width}
      className="my-6 rounded-md"
      {...props}
      alt={node}
    />
  );
}

export function MdLink({ node, children, ...props }: any) {
  return (
    <Link
      to={props.href}
      prefetch="intent"
      className="text-blue-700"
      {...props}
    >
      {children}
    </Link>
  );
}
