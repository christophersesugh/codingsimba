/* eslint-disable react/prop-types */
import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { Link } from "@remix-run/react";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCheckmarkDone, IoWarning } from "react-icons/io5";
import { Button } from "~/components/ui/button";
import { useToast } from "../ui/use-toast";
import highlightjs from "highlight.js";
import { FaLightbulb } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { cn } from "~/utils/shadcn";

type ElemProps = {
  children?: React.ReactNode;
};

/**
 *
 * @param {React.HTMLAttributes<HTMLParagraphElement | HTMLImageElement>} props
 * @returns {JSX.Element}
 */
export function P(
  props: React.HTMLAttributes<HTMLParagraphElement | HTMLImageElement>
): JSX.Element {
  if (
    React.isValidElement(props.children) &&
    typeof props.children.type === "string" &&
    props.children.type === "img"
  ) {
    return <>{props.children}</>;
  }
  return <p className="my-4" {...props} />;
}

/**
 * Div component
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @returns {JSX.Element}
 */
export function Div(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const { className, children, ...rest } = props;

  if (className) {
    if (className.includes("remark-container info")) {
      return (
        <div
          className={cn(
            "border-green-600 text-green-900 bg-green-100/30",
            className
          )}
          {...rest}
        >
          <span className="icon text-green-800">
            <FaLightbulb size={25} />
          </span>
          {children}
        </div>
      );
    } else if (className.includes("remark-container warning")) {
      return (
        <div
          className={cn(
            className,
            "border-yellow-600 text-yellow-800 bg-yellow-100/30"
          )}
          {...rest}
        >
          <span className="icon text-yellow-700">
            <IoWarning size={25} />
          </span>
          {children}
        </div>
      );
    } else if (className.includes("remark-container caution")) {
      return (
        <div
          className={cn(className, "border-red-500 text-red-700 bg-red-100/50")}
          {...rest}
        >
          <span className="icon text-red-600">
            <RiErrorWarningFill size={25} />
          </span>
          {children}
        </div>
      );
    }
  }

  return (
    <div {...rest} className={className}>
      {children}
    </div>
  );
}

export function H1(props: ElemProps): React.ReactElement {
  return (
    <h1 className="text-3xl my-6 dark:text-amber-600 text-amber-700" {...props}>
      {props.children}
    </h1>
  );
}

export function H2(props: ElemProps): React.ReactElement {
  return (
    <h2 className="text-2xl my-6 dark:text-amber-600 text-amber-700" {...props}>
      {props.children}
    </h2>
  );
}
export function H3(props: ElemProps): React.ReactElement {
  return (
    <h3 className="text-xl my-6 dark:text-amber-600 text-amber-700" {...props}>
      {props.children}
    </h3>
  );
}

export function H4(props: ElemProps): React.ReactElement {
  return (
    <h4 className="text-lg my-6 dark:text-amber-600 text-amber-700" {...props}>
      {props.children}
    </h4>
  );
}

export function H5(props: ElemProps): React.ReactElement {
  return (
    <h4 className="text-lg my-6 dark:text-amber-600 text-amber-700" {...props}>
      {props.children}
    </h4>
  );
}

export function H6(props: ElemProps): React.ReactElement {
  return (
    <h4 className="text-lgmy-6 dark:text-amber-600 text-amber-700" {...props}>
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

export function LI(props: ElemProps): React.ReactElement {
  return (
    <li className="my-4" {...props}>
      {props.children}
    </li>
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
    });
    window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  let language = null;
  if (className) {
    language = className.replace(/language-/, "");
  }
  if (isServer) return null;
  return language ? (
    <div className="relative">
      <pre
        className={cn(
          "hljs light:bg-gray-200 rouned-md text-md p-4 my-5 pb-6 overflow-x-auto",
          className
        )}
        {...props}
      >
        {language ? (
          <span className="text-slate-400 text-xs absolute bottom-2 right-2">
            {language}
          </span>
        ) : null}

        <Button
          className="text-slate-500 text-xs absolute bg- right-0 top-0 rounded-tl-none rounded-br-none"
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
          className={className}
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
    <code className="text-sm px-1 rounded-md bg-slate-200 dark:bg-slate-700">
      {children}
    </code>
  );
}
