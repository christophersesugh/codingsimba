import React from "react";
import type { Route } from "./+types";
import { ContentFilter } from "~/components/content-filter";
import { Header } from "~/components/content-page-header";
import { FeaturedArticle } from "./components/featured-article";
import { Link, useSearchParams } from "react-router";
import { ArticleCard } from "~/components/article-card";
import { ArticlePagination } from "./components/pagination";
import {
  getAllCategories,
  getArticles,
  UrlSchema,
} from "~/services.server/sanity/articles";
import { invariantResponse } from "~/utils/misc";
import { EmptyState } from "~/components/empty-state";
import { Search } from "lucide-react";
import { StatusCodes } from "http-status-codes";

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
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const { data: categories } = await getAllCategories();
  const articlesData = await getArticles({
    search,
    tag,
    order,
    category,
    start,
    end,
  });

  invariantResponse(articlesData, "No articles found", {
    status: StatusCodes.NOT_FOUND,
  });

  return {
    articles: articlesData.articles,
    total: articlesData.total,
    currentPage: page,
    totalPages: Math.ceil(articlesData.total / PAGE_SIZE),
    categories,
  };
}

export default function ArticlesRoute({ loaderData }: Route.ComponentProps) {
  const [, setSearchParams] = useSearchParams();
  const { articles, currentPage, totalPages, categories } = loaderData;

  const featuredArticle = React.useMemo(
    () => articles.find((article) => article.featured),
    [articles],
  );
  const filteredArticles = React.useMemo(
    () => articles.filter((article) => !article.featured),
    [articles],
  );

  const PAGE = "page";

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
    <div>
      <Header
        title="articles"
        description="In-depth articles to help you stay ahead in web development."
        placeholder="search articles..."
      />
      <div className="container mx-auto px-4 pb-12 pt-6">
        <ContentFilter categories={categories} />
        {featuredArticle ? <FeaturedArticle article={featuredArticle} /> : null}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles?.length
            ? filteredArticles.map((article, index) => (
                <Link
                  prefetch="intent"
                  key={article.id}
                  to={`/articles/${article.slug}`}
                >
                  <ArticleCard article={article} index={index} />
                </Link>
              ))
            : null}
        </div>
        {!filteredArticles?.length ? (
          <EmptyState
            icon={<Search className="size-8" />}
            title="No results found"
            description="We couldn't find any matches for your search. Try adjusting your search terms or filters."
            action={{
              label: "Clear filters",
              onClick: resetFilters,
            }}
          />
        ) : null}
        {!filteredArticles?.length ? null : (
          <ArticlePagination
            totalPages={totalPages}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
}
