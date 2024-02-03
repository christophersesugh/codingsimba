import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { Link } from "@remix-run/react";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button } from "~/components/ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import highlightjs from "highlight.js";

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
    >
      {props.children}
    </h1>
  );
}

export function H2(props: ElemProps): React.ReactElement {
  return (
    <h2
      className="text-2xl mt-4 mb-3 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    >
      {props.children}
    </h2>
  );
}
export function H3(props: ElemProps): React.ReactElement {
  return (
    <h3
      className="text-xl mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    >
      {props.children}
    </h3>
  );
}

export function H4(props: ElemProps): React.ReactElement {
  return (
    <h4
      className="text-lg mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    >
      {props.children}
    </h4>
  );
}

export function H5(props: ElemProps): React.ReactElement {
  return (
    <h4
      className="text-lg mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    >
      {props.children}
    </h4>
  );
}

export function H6(props: ElemProps): React.ReactElement {
  return (
    <h4
      className="text-lg mt-3 mb-2 capitalize dark:text-amber-600 text-amber-700"
      {...props}
    >
      {props.children}
    </h4>
  );
}

export function UL(props: ElemProps): React.ReactElement {
  return (
    <ul className="list-disc list-inside space-y-3 text-lg" {...props}>
      {props.children}
    </ul>
  );
}

export function OL(props: ElemProps): React.ReactElement {
  return (
    <ol className="list-decimal list-inside space-y-3 text-lg" {...props}>
      {props.children}
    </ol>
  );
}

export function BlockQuote(props: ElemProps): React.ReactElement {
  return (
    <blockquote
      className=" bg-blue-100 dark:bg-blue-200  border-l-8 border-blue-500 text-black p-4 my-6 rounded-md relative"
      {...props}
    >
      <BsInfoCircle title="Info" className="w-6 h-6 absolute top-2 right-2" />
      {props.children}
    </blockquote>
  );
}

export function Strong(props: ElemProps): React.ReactElement {
  return (
    <strong className="font-bold text-black dark:text-white" {...props}>
      {props.children}
    </strong>
  );
}

export function B(props: ElemProps): React.ReactElement {
  return (
    <b className="font-bold text-black dark:text-white" {...props}>
      {props.children}
    </b>
  );
}

export function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line react/prop-types
  return <img className="my-6 rounded-sm mx-auto" {...props} alt={props.alt} />;
}

// interface LinkProps {
//   href: string;
//   target?: "_blank" | "_self" | "_parent" | "_top" | string;
//   rel?: string;
//   prefetch?: "intent" | "none";
//   children?: React.ReactNode;
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MdLink(props: any): React.ReactElement {
  return (
    <Link
      to={props.href}
      target="_blank"
      rel="noreferrer"
      prefetch="intent"
      className="text-blue-700"
      {...props}
    >
      {props.children}
    </Link>
  );
}

type CodeBlockProps = {
  className?: string;
  children?: React.ReactNode;
};

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isServer, setIsServer] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    setIsServer(false);
  }, []);

  function handleCopied() {
    window.navigator.clipboard.writeText(children as string);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
    window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  let language = null;
  if (className) {
    language = className.replace(/language-/, "");
  }
  if (isServer) return <p>Loading...</p>;
  return language ? (
    <div className="relative">
      <pre
        className={`hljs rouned-md text-md p-4 my-5 overflow-x-auto ${className}`}
        {...props}
      >
        {language ? (
          <Badge className="font-normal bg-cyan-700 dark:bg-cyan-700 text-slate-200 dark:text-slate-200 p-0 px-1 rounded-tr-none rounded-bl-none absolute top-0 left-0">
            {language}
          </Badge>
        ) : null}

        <Button
          className="text-slate-300 text-xs absolute bg- right-0 top-0 rounded-tl-none rounded-br-none"
          variant="ghost"
          size="sm"
          onClick={handleCopied}
        >
          {copied ? (
            <>
              <IoCheckmarkDone className="mr-2 h-3 w-3" /> Copied!
            </>
          ) : (
            <>
              <MdOutlineContentCopy className="mr-2 h-3 w-3" /> Copy
            </>
          )}
        </Button>

        <code
          className={language}
          dangerouslySetInnerHTML={{
            __html:
              typeof children === "string"
                ? highlightjs.highlight(children.trim(), {
                    language,
                  }).value
                : "",
          }}
        />
      </pre>
    </div>
  ) : (
    <code className="text-sm px-1 rounded-md bg-slate-300 dark:bg-slate-600">
      {children}
    </code>
  );
}
