import React from "react";
import { Link } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { useToc } from "~/hooks/use-toc";
// import { useMarkdownToc } from "use-markdown-toc";
import { cn } from "~/lib/shadcn";
import { Badge } from "./ui/badge";
import { formatTime } from "~/utils/misc";

type PageData = {
  timeSpent: number;
  isActive: boolean;
};

/**
 * Memoized Table of Contents component.
 */
function TOC({
  className,
  pageData,
}: {
  className?: string;
  pageData: PageData;
}) {
  const { headings, activeId } = useToc({
    containerId: "markdown-content",
  });

  return (
    <div
      className={cn(
        "relative mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <Badge className="absolute right-0 top-0 rounded-br-none rounded-tl-none">
        Time spent on this page:{" "}
        <span className="font-bold">{formatTime(pageData.timeSpent)}</span>{" "}
        {pageData.isActive ? "🟢" : "🔴"}
      </Badge>
      <h3 className="mb-4 text-lg font-bold">Table of Contents</h3>
      <nav className="space-y-3">
        <ul>
          {headings?.length ? (
            headings
              .filter((h) => !!h.id)
              .map((heading) => {
                const { id, text } = heading;
                const activeItem = activeId === id;

                return (
                  <li key={id}>
                    <Link
                      to={`#${id}`}
                      className={cn(
                        "block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
                        {
                          "text-blue-700 dark:text-blue-600": activeItem,
                        },
                      )}
                    >
                      <span className="mr-2 font-bold">{"👉🏽"}</span>
                      {text}
                    </Link>
                  </li>
                );
              })
          ) : (
            <>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="mt-2 h-2 w-full" />
              <Skeleton className="mt-2 h-2 w-full" />
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export const TableOfContent = React.memo(TOC);
