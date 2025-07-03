import React from "react";
import type { Route } from "./+types";
import { UrlSchema } from "~/utils/content.server/shared-types";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { StatusCodes } from "http-status-codes";
import { ContentFilter } from "~/components/content-filter";
import { Header } from "~/components/page-header";
import { FeaturedArticle } from "./components/featured-article";
import { ArticleCard } from "~/routes/articles/components/article-card";
import { ContentPagination } from "~/components/content-pagination";
import {
  getArticles,
  getFeaturedArticle,
} from "~/utils/content.server/articles/utils";
import { invariantResponse } from "~/utils/misc";
import { EmptyState } from "~/components/empty-state";
import { generateMetadata } from "~/utils/meta";
import { getAllCategories } from "~/utils/content.server/shared-utils";

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  const parsedParams = UrlSchema.safeParse(searchParams);

  invariantResponse(parsedParams.success, "Invalid parameters", {
    status: StatusCodes.BAD_REQUEST,
  });

  const { search, tag, order, category, page } = parsedParams.data;

  const PAGE_SIZE = 6;

  const safePage = Math.max(0, page);
  const safeStart = (safePage - 1) * PAGE_SIZE;
  const safeEnd = safeStart + PAGE_SIZE;

  const categories = getAllCategories();
  const featuredArticle = getFeaturedArticle();
  const articlesData = await getArticles({
    search,
    tag,
    order,
    category,
    start: safeStart,
    end: safeEnd,
  });

  return {
    featuredArticle,
    articles: articlesData.articles,
    total: articlesData.total,
    currentPage: safePage,
    totalPages: Math.ceil(articlesData.total / PAGE_SIZE),
    categories,
  };
}

export default function ArticlesRoute({ loaderData }: Route.ComponentProps) {
  const metadata = generateMetadata({ title: "Articles | Coding Simba" });
  const [searchParams, setSearchParams] = useSearchParams();
  const { articles, currentPage } = loaderData;

  const search = searchParams.get("search");
  const PAGE = "page";
  const isIndexPage = currentPage === 1;

  const resetFilters = React.useCallback(() => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams();
      const page = prevParams.get(PAGE);
      if (page) {
        params.set(PAGE, page);
      }
      return params;
    });
  }, [setSearchParams]);

  return (
    <>
      {metadata}
      <Header
        title="articles"
        description="In-depth articles to help you stay ahead in software development."
        placeholder="search for articles..."
        enableSearch
      />
      <section className="container mx-auto px-4 pb-12 pt-6">
        <ContentFilter />
        {isIndexPage && !search ? <FeaturedArticle /> : null}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles?.length
            ? articles.map((article, index) => (
                <Link
                  prefetch="intent"
                  key={article.id}
                  to={`/articles/${article.slug}`}
                >
                  <ArticleCard article={article} index={index} />
                </Link>
              ))
            : null}
        </section>
        {articles?.length ? (
          <ContentPagination />
        ) : (
          <EmptyState
            icon={<Search className="size-8" />}
            title="No results found"
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
