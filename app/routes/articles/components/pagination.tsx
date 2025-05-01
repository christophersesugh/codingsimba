import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "~/components/ui/pagination";
import { VisuallyHidden } from "~/components/ui/visually-hidden";

type ArticlePaginationProps = {
  totalPages: number;
  currentPage: number;
};

export function ArticlePagination({
  totalPages,
  currentPage,
}: ArticlePaginationProps) {
  const firstPage = Math.max(1, currentPage - 2);
  const lastPage = Math.min(totalPages, currentPage + 2);

  const pageNumbers = React.useMemo(() => {
    const pages = [];
    for (let i = firstPage; i <= lastPage; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }
    return pages;
  }, [firstPage, lastPage, totalPages]);

  const MIN_PAGE = 1;

  return (
    <Pagination className="mx-auto mt-12">
      <PaginationContent className="flex items-center gap-2">
        {/* Previous Button */}
        <PaginationItem>
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage <= MIN_PAGE}
          >
            <Link
              to={{
                pathname: "/articles",
                search: `?page=${currentPage - MIN_PAGE}`,
              }}
              className="flex items-center gap-1"
              aria-disabled={currentPage <= MIN_PAGE}
            >
              <ChevronLeft className="size-4" />
              <VisuallyHidden>Previous page</VisuallyHidden>
            </Link>
          </Button>
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Button
              size={"icon"}
              variant={currentPage === pageNumber ? "default" : "outline"}
              disabled={currentPage === pageNumber}
              aria-label={`Page ${pageNumber}`}
              asChild
            >
              <Link
                to={{
                  pathname: "/articles",
                  search: `?page=${pageNumber}`,
                }}
                className={`flex items-center ${
                  currentPage === pageNumber ? "pointer-events-none" : ""
                }`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Link>
            </Button>
          </PaginationItem>
        ))}

        {/* Ellipsis for many pages */}
        {lastPage < totalPages ? (
          <PaginationItem>
            <VisuallyHidden>More pages</VisuallyHidden>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}

        {/* Next Button */}
        <PaginationItem>
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <Link
              to={{
                pathname: "/articles",
                search: `?page=${currentPage + MIN_PAGE}`,
              }}
              prefetch="intent"
              aria-disabled={currentPage >= totalPages}
            >
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
