import React from "react";
import { Check, Copy } from "lucide-react";
import ShikiHighlighter, { type Element } from "react-shiki";
import { useTheme } from "remix-themes";
import { cn } from "~/lib/shadcn";
import { Skeleton } from "~/components/ui/skeleton";
import { StylishSandpack, type SandpackTemplate } from "./sandpack";
import { Iframe } from "./media";

interface CodeHighlightProps {
  className?: string;
  children?: React.ReactNode;
  node?: Element;
  inline: boolean;
}

export function Code({
  inline,
  className,
  children,
  // node,
  ...props
}: CodeHighlightProps): React.ReactElement {
  const [mounted, setMounted] = React.useState(false);
  const themes = {
    light: "one-light",
    dark: "night-owl",
  };

  const basicClassName =
    "-mx-4 relative -my-3 block overflow-visible rounded-md border-0";

  const [theme] = useTheme();
  const isDark = theme === "dark";
  const currentTheme = isDark ? themes.dark : themes.light;

  const match = className?.match(/language-(\w+)/);
  const language = match?.[1]?.toLowerCase();

  //Iframe
  const isYoutube = language?.startsWith("youtube");
  const isBunny = language?.startsWith("bunny");
  const isIframe = !!isYoutube || !!isBunny;

  //Sandpack
  const sandpackTemplate = language?.startsWith("sandpack_")
    ? (language.replace("sandpack_", "") as SandpackTemplate)
    : null;
  const isSandpack = !!sandpackTemplate;

  //Code
  const isInline = inline || !language;
  const code =
    typeof children === "string" ? children.trim() : String(children).trim();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const shouldSkipParagraph = React.useMemo(() => {
    const ignoredTypes = [
      "p",
      "img",
      "div",
      "code",
      "Code",
      "pre",
      "ul",
      "ol",
      "blockquote",
    ];

    if (!children) return false;

    /**
     * Check if the element is a Code component,
     * because shiki wraps code, pre, and div elements inside p elements
     * @param {element} element - The element to check
     * @returns {boolean} - Returns true if the element is a Code component
     */
    function isCodeComponent(element: React.ReactElement): boolean {
      if (typeof element.type === "function" && "name" in element.type) {
        return element.type.name === "Code";
      }
      return false;
    }

    /**
     * Check if the element is a valid React element and if its
     * type is in the ignoredTypes array or if it is a
     * Fragment or a Code component so we do not wrap it in a p element
     */
    if (React.isValidElement(children)) {
      const elementType = children.type;
      return (
        (typeof elementType === "string" &&
          ignoredTypes.includes(elementType)) ||
        elementType === React.Fragment ||
        isCodeComponent(children)
      );
    }

    /**
     * Check if the children is an array of elements
     * and if any of them are in the ignoredTypes array
     * or if it is a Fragment or a Code component
     */
    if (Array.isArray(children)) {
      return children.some(
        (child) =>
          React.isValidElement(child) &&
          ((typeof child.type === "string" &&
            ignoredTypes.includes(child.type)) ||
            child.type === React.Fragment ||
            isCodeComponent(child)),
      );
    }

    return false;
  }, [children]);

  if (shouldSkipParagraph) {
    return <>{children}</>;
  }

  if (!mounted)
    return (
      <div className={basicClassName}>
        <Skeleton className="h-40 w-full" />
      </div>
    );

  /**
   * IFRAME
   */
  if (isIframe) {
    return (
      <div className={basicClassName}>
        <Iframe videoId={code} type={isYoutube ? "youtube" : "bunny"} />
      </div>
    );
  }

  /**
   * SANDPACK
   */
  if (isSandpack) {
    const { files, visibleFiles, activeFile = "" } = JSON.parse(String(code));
    return (
      <div
        className={cn(
          basicClassName,
          "-mx-2.5 -my-1.5 dark:-mx-2.5 dark:-my-2",
        )}
      >
        <StylishSandpack
          files={files}
          options={{
            activeFile,
            visibleFiles,
          }}
          template={sandpackTemplate}
        />
      </div>
    );
  }

  return !isInline ? (
    <div className={cn(basicClassName, className)}>
      <CopyButton code={code} />
      <ShikiHighlighter
        language={language}
        theme={currentTheme}
        langClassName="left-2 !top-[3px]"
        delay={150}
        {...props}
      >
        {code}
      </ShikiHighlighter>
    </div>
  ) : (
    <pre
      className={cn(
        "inline rounded bg-gray-100 px-1 py-0.5 font-mono text-sm",
        "text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        className,
      )}
      {...props}
    >
      <code>{code}</code>
    </pre>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    });
  }

  return (
    <button
      onClick={copyToClipboard}
      className="absolute right-2 top-2 z-10 rounded-md bg-gray-200/80 p-2 transition-colors hover:bg-gray-300 dark:bg-[#112630] dark:hover:bg-[#1d3b47]"
      aria-label="Copy code"
      disabled={copied}
    >
      {copied ? (
        <Check size={16} className="text-blue-600" />
      ) : (
        <Copy size={16} className="text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}
