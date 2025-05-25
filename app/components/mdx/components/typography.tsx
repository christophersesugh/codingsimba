import React from "react";
import { Quote } from "lucide-react";
import { Link, type LinkProps } from "react-router";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/shadcn";

export function H1({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "mb-6 mt-10 scroll-m-20 text-3xl font-bold tracking-normal lg:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

export function H2({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-200",
        "mb-4 mt-8 dark:border-gray-800",
        className,
      )}
      {...props}
    />
  );
}

export const H3 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200",
      "mb-4 mt-8 dark:border-gray-800",
      className,
    )}
    {...props}
  />
);

export const H4 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-200",
      "mb-4 mt-8 dark:border-gray-800",
      className,
    )}
    {...props}
  />
);

export const H5 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-200",
      "mb-4 mt-8 dark:border-gray-800",
      className,
    )}
    {...props}
  />
);

export const H6 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h6
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-200",
      "mb-4 mt-8 dark:border-gray-800",
      className,
    )}
    {...props}
  />
);

export function P({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const shouldSkipParagraph = React.useMemo(() => {
    const ignoredTypes = [
      "p",
      "img",
      "div",
      "code",
      "pre",
      "table",
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

  return (
    <p
      className={cn(
        "leading-7.5 text-[1.05em] tracking-wide text-gray-700 dark:text-gray-300 [&:not(:first-child)]:mt-6",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Subtle({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  );
}

export function Blockquote({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <div className="relative">
      <Quote className="absolute -top-2 left-2 size-4 text-gray-300 dark:text-gray-600" />
      <blockquote
        className={cn(
          "pl-8 italic text-gray-600 dark:text-gray-400",
          "border-l-4 border-gray-200 dark:border-gray-700",
          "relative overflow-visible",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface AProps extends LinkProps {
  className?: string;
  to: string;
}

export function A({ className, to: href, ...props }: AProps) {
  const target = href?.startsWith("http") ? "_blank" : undefined;
  const rel = href?.startsWith("http") ? "noopener noreferrer" : undefined;

  return (
    <Link
      to={href || "#"}
      prefetch="intent"
      target={target}
      rel={rel}
      className={cn(
        "font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        className,
      )}
      {...props}
    />
  );
}

export function Hr({ className, ...props }: { className?: string }) {
  return <Separator className={cn("my-2", className)} {...props} />;
}
