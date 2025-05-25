import React from "react";
import ShikiHighlighter, { type Element } from "react-shiki";
import type { SandpackTemplate } from "~/services.server/sanity/articles/types";
import { Check, Codesandbox, Copy, Youtube } from "lucide-react";
import { useTheme } from "remix-themes";
import { cn } from "~/lib/shadcn";
import { Skeleton } from "~/components/ui/skeleton";
import { Sandpack } from "./sandpack";
import { Iframe } from "./media";
import { EmptyState } from "~/components/empty-state";

/**
 * Available theme options for code highlighting
 */
const THEMES = {
  light: "one-light",
  dark: "night-owl",
} as const;

/**
 * Base className for code blocks
 */
const BASE_CLASS_NAME =
  "-mx-4 relative -my-3 block overflow-visible rounded-md border-0";

/**
 * Types of elements that should not be wrapped in paragraph tags
 */
const IGNORED_ELEMENT_TYPES = [
  "p",
  "img",
  "div",
  "code",
  "Code",
  "pre",
  "ul",
  "ol",
  "blockquote",
] as const;

/**
 * Props for the Code component
 */
interface CodeHighlightProps {
  /** Additional CSS class names */
  className?: string;
  /** Child elements or content */
  children?: React.ReactNode;
  /** Shiki element node */
  node?: Element;
  /** Array of Sandpack templates */
  sandpackTemplates?: SandpackTemplate[];
  /** Whether the code is inline */
  inline: boolean;
}

function InvalidSandboxTemplate() {
  return (
    <div className={cn("bg-white dark:bg-gray-700", BASE_CLASS_NAME)}>
      <EmptyState
        icon={<Codesandbox size={30} className="animate-spin text-red-500" />}
        title="Invalid sandbox template"
        className="bg-red-300/60 dark:bg-red-950"
      />
    </div>
  );
}

/**
 * Props for the CopyButton component
 */
interface CopyButtonProps {
  /** Code content to be copied */
  code: string;
}

/**
 * Button component for copying code to clipboard
 * @param {CopyButtonProps} props - Component props
 * @returns {JSX.Element} Copy button with success state
 */
const CopyButton = React.memo(function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    });
  }, [code]);

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
});

/**
 * Main Code component that handles code highlighting, Sandpack integration, and iframe embedding
 * @param {CodeHighlightProps} props - Component props
 * @returns {JSX.Element} Code component with appropriate rendering based on content type
 */
export function Code({
  inline,
  className,
  children,
  sandpackTemplates,
  ...props
}: CodeHighlightProps): React.ReactElement {
  const [mounted, setMounted] = React.useState(false);
  const [theme] = useTheme();
  const isDark = theme === "dark";
  const currentTheme = isDark ? THEMES.dark : THEMES.light;

  const match = className?.match(/language-(\w+)/);
  const language = match?.[1]?.toLowerCase();

  // Content type detection
  const iframe = React.useMemo(() => {
    const isYoutube = language?.startsWith("youtube") ?? null;
    const isBunny = language?.startsWith("bunny") ?? null;
    const isValidId = children ? String(children).trim() : null;
    return {
      isBunny,
      isYoutube,
      isValidId,
      isValidLanguage: isYoutube ?? isBunny,
    };
  }, [children, language]);

  const isSandpack = React.useMemo(
    () => !!(language?.startsWith("sandpack") ?? null),
    [language],
  );

  // Code content processing
  const isInline = React.useMemo(() => inline || !language, [inline, language]);
  const code = React.useMemo(
    () =>
      typeof children === "string" ? children.trim() : String(children).trim(),
    [children],
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Determines if the element should skip paragraph wrapping
   * @returns {boolean} True if the element should not be wrapped in a paragraph
   */
  const shouldSkipParagraph = React.useMemo(() => {
    if (!children) return false;

    /**
     * Check if the element is a Code component
     * @param {React.ReactElement} element - The element to check
     * @returns {boolean} True if the element is a Code component
     */
    function isCodeComponent(element: React.ReactElement): boolean {
      if (typeof element.type === "function" && "name" in element.type) {
        return element.type.name === "Code";
      }
      return false;
    }

    if (React.isValidElement(children)) {
      const elementType = children.type;
      return (
        (typeof elementType === "string" &&
          IGNORED_ELEMENT_TYPES.includes(
            elementType as (typeof IGNORED_ELEMENT_TYPES)[number],
          )) ||
        elementType === React.Fragment ||
        isCodeComponent(children)
      );
    }

    if (Array.isArray(children)) {
      return children.some(
        (child) =>
          React.isValidElement(child) &&
          ((typeof child.type === "string" &&
            IGNORED_ELEMENT_TYPES.includes(
              child.type as (typeof IGNORED_ELEMENT_TYPES)[number],
            )) ||
            child.type === React.Fragment ||
            isCodeComponent(child)),
      );
    }

    return false;
  }, [children]);

  if (shouldSkipParagraph) {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className={BASE_CLASS_NAME}>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  // Handle iframe content
  if (iframe.isValidLanguage) {
    if (!iframe.isValidId) {
      return (
        <div className={cn("bg-white dark:bg-gray-700", BASE_CLASS_NAME)}>
          <EmptyState
            icon={<Youtube size={30} className="animate-pulse text-red-500" />}
            title="Invalid YouTube ID"
            className="bg-red-300/60 dark:bg-red-950"
          />
        </div>
      );
    }

    return (
      <div className={BASE_CLASS_NAME}>
        <Iframe videoId={code} type={iframe.isYoutube ? "youtube" : "bunny"} />
      </div>
    );
  }

  // Handle Sandpack content
  if (isSandpack) {
    const templateSlug = code ? String(code).trim() : null;
    const isTemplates =
      templateSlug && sandpackTemplates && sandpackTemplates?.length;

    if (!isTemplates) {
      return <InvalidSandboxTemplate />;
    }

    const template = sandpackTemplates.find(
      (template) => template.slug === templateSlug,
    );

    if (!template) {
      return <InvalidSandboxTemplate />;
    }

    return (
      <div className={BASE_CLASS_NAME}>
        <Sandpack sandpackTemplate={template} />
      </div>
    );
  }

  // Handle regular code blocks
  return !isInline ? (
    <div className={cn(BASE_CLASS_NAME, className)}>
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
