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

type ContentPaginationProps = {
  totalPages: number;
  currentPage: number;
};

export function ContentPagination({
  totalPages,
  currentPage,
}: ContentPaginationProps) {
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

  return (
    <Pagination className="mx-auto mt-12">
      <PaginationContent className="flex items-center gap-2">
        {/* Previous Button */}
        <PaginationItem>
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link
                to={{
                  pathname: "/articles",
                  search: `?page=${currentPage - 1}`,
                }}
                className="flex items-center gap-1"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
                <VisuallyHidden>Previous page</VisuallyHidden>
              </Link>
            ) : (
              <div className="flex items-center gap-1">
                <ChevronLeft className="size-4" />
                <VisuallyHidden>Previous page</VisuallyHidden>
              </div>
            )}
          </Button>
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Button
              size="icon"
              variant={currentPage === pageNumber ? "default" : "outline"}
              disabled={currentPage === pageNumber}
              aria-label={`Page ${pageNumber}`}
              asChild={currentPage !== pageNumber}
            >
              {currentPage !== pageNumber ? (
                <Link
                  to={{
                    pathname: "/articles",
                    search: `?page=${pageNumber}`,
                  }}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </Link>
              ) : (
                <div>{pageNumber}</div>
              )}
            </Button>
          </PaginationItem>
        ))}

        {/* Ellipsis for many pages */}
        {lastPage < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
            <VisuallyHidden>More pages</VisuallyHidden>
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link
                to={{
                  pathname: "/articles",
                  search: `?page=${currentPage + 1}`,
                }}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
                <VisuallyHidden>Next page</VisuallyHidden>
              </Link>
            ) : (
              <div>
                <ChevronRight className="size-4" />
                <VisuallyHidden>Next page</VisuallyHidden>
              </div>
            )}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
