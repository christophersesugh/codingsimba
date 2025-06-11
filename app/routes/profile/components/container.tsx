import React from "react";
import { cn } from "~/lib/shadcn";

export function Container({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        {description ? <div>{description}</div> : null}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
