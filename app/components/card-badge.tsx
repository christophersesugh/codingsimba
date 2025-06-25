import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "~/utils/misc";

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
        "absolute top-3 left-3 border border-blue-200 bg-blue-600 text-white dark:border-blue-200 dark:bg-blue-600 dark:text-white",
        className,
      )}
    >
      {children}
    </Badge>
  );
}
