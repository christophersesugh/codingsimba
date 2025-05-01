import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "~/lib/shadcn";

export function CardBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "absolute left-3 top-3 border border-blue-200 bg-blue-600 text-white dark:border-blue-200 dark:bg-blue-600 dark:text-white",
        className,
      )}
    >
      {children}
    </Badge>
  );
}
