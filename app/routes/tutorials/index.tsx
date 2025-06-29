import React from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Header } from "~/components/page-header";
// import { ContentFilter } from "~/components/content-filter";
// import { ContentPagination } from "~/components/content-pagination";
import { EmptyState } from "~/components/empty-state";
import { TutorialCard } from "./components/tutorial-card";
import { tutorials, type Tutorial } from "./data";
import { generateMetadata } from "~/utils/meta";

export default function TutorialsRoute() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";

  const PAGE_SIZE = 6;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  // Filter tutorials based on search params
  let filteredTutorials = tutorials;

  if (search) {
    filteredTutorials = filteredTutorials.filter(
      (tutorial: Tutorial) =>
        tutorial.title.toLowerCase().includes(search.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(search.toLowerCase()) ||
        tutorial.tags.some((tag: string) =>
          tag.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  }

  if (category) {
    filteredTutorials = filteredTutorials.filter((tutorial: Tutorial) =>
      tutorial.tags.some(
        (tag: string) => tag.toLowerCase() === category.toLowerCase(),
      ),
    );
  }

  if (tag) {
    filteredTutorials = filteredTutorials.filter((tutorial: Tutorial) =>
      tutorial.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase()),
    );
  }

  const currentTutorials = filteredTutorials.slice(start, end);

  const resetFilters = React.useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    return params;
  }, []);

  return (
    <>
      {generateMetadata({ title: "Tutorials | Coding Simba" })}
      <Header
        title="tutorials"
        description="Practical, hands-on tutorials to help you master specific technologies and concepts."
        placeholder="search for tutorials..."
        enableSearch
      />
      <section className="container mx-auto px-4 pb-12 pt-6">
        {/* <ContentFilter /> */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentTutorials?.length
            ? currentTutorials.map((tutorial) => (
                <Link
                  prefetch="intent"
                  key={tutorial.id}
                  to={`/tutorials/${tutorial.id}`}
                >
                  <TutorialCard tutorial={tutorial} />
                </Link>
              ))
            : null}
        </section>
        {currentTutorials?.length ? (
          // <ContentPagination />
          <div>Pagination</div>
        ) : (
          <EmptyState
            icon={<Search className="size-8" />}
            title="No tutorials found"
            description="We couldn't find any matches for your search. Try adjusting your search terms or filters."
            action={{
              label: "Clear filters",
              onClick: resetFilters,
            }}
          />
        )}
      </section>
    </>
  );
}
