import React from "react";
import { Quote } from "lucide-react";
import { Link, type LinkProps } from "react-router";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/shadcn";
import { Callout } from "~/components/ui/callout";

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
  if (React.isValidElement(children) && children.type === "img") {
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

export function Pre({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre className={cn("p-0", className)} {...props}>
      {children}
    </pre>
  );
}

type CalloutVariant = "info" | "warning" | "error";

interface TitleChildProps {
  className?: string;
  children?: React.ReactNode;
}

export function Div({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const variants: Record<CalloutVariant, string> = {
    info: "Info",
    warning: "Warning",
    error: "Error",
  };

  const childrenArray = React.Children.toArray(children);

  const titleChild = childrenArray.find((child: React.ReactNode) => {
    if (!React.isValidElement<TitleChildProps>(child)) return false;
    return (
      typeof child.props.className === "string" &&
      child.props.className.includes("remark-container-title")
    );
  });

  const contentChildren = childrenArray.filter((child) => child !== titleChild);

  const variant = React.isValidElement<TitleChildProps>(titleChild)
    ? ((titleChild.props.className?.match(
        /info|warning|error/,
      )?.[0] as CalloutVariant) ?? "info")
    : null;

  const title = React.isValidElement<TitleChildProps>(titleChild)
    ? String(titleChild.props.children)
    : variant
      ? variants[variant]
      : undefined;

  if (variant) {
    return (
      <Callout
        variant={variant}
        title={title}
        className={cn("my-8", className)}
        {...props}
      >
        {contentChildren}
      </Callout>
    );
  }

  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
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
