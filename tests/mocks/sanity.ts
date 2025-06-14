import { http, HttpResponse, passthrough, type HttpHandler } from "msw";
import { StatusCodes } from "http-status-codes";
import { SANITY_API_URL } from "~/services.server/sanity/loader";
import {
  articleDetailsQuery,
  categoryQuery,
  countQuery,
  recentArticlesQuery,
  relatedQuery,
  tagQuery,
} from "~/services.server/sanity/articles/queries";
import { readPageContent } from "~/utils/misc.server";

export const handlers: HttpHandler[] = [
  http.get(SANITY_API_URL, async ({ request }) => {
    return passthrough();
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) {
      return new HttpResponse(
        JSON.stringify({ error: "Query parameter is required" }),
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    if (
      query.includes('"articles": *[_type == "article" && published == true')
    ) {
      return retrieveArticles(url, query);
    }

    if (query === countQuery) {
      const count = articles.filter((a) => a.published).length;
      return HttpResponse.json({
        result: {
          count,
        },
      });
    }

    if (query === articleDetailsQuery) {
      return passthrough();
      // return retrieveArticleBySlug(url);
    }

    if (query === relatedQuery) {
      return retrieveRelatedArticles(url);
    }

    if (query === recentArticlesQuery()) {
      return retrieveRecentArticles();
    }

    if (query === tagQuery) {
      return retrieveTags();
    }

    if (query === categoryQuery) {
      return retrieveCategories();
    }
    /**
     * SANDPACK
     */
    if (
      query.includes('_type == "sandpack"') &&
      query.includes("slug.current == $slug")
    ) {
      return passthrough();
    }

    return new HttpResponse(
      JSON.stringify({
        error: "Not Found",
        message: `No mock handler for query: ${query}`,
      }),
      {
        status: StatusCodes.NOT_FOUND,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),
];

//UTILS
const DEFAULT_PAGE_SIZE = 6;

type EPPReturnObj = {
  start: number;
  end: number;
  search: string | null;
  category: string | null;
  order: string | null;
};

function extractPaginationParams(url: URL, query: string): EPPReturnObj {
  const startParam = url.searchParams.get("$start");
  const endParam = url.searchParams.get("$end");

  const start = Math.max(0, Number(startParam ?? 0));
  const end = Math.max(
    start + 1,
    Number(endParam ?? start + DEFAULT_PAGE_SIZE),
  );

  const filterMatch = query.match(/\*\[([^\]]+)\]/);
  const filters = filterMatch ? filterMatch[1] : "";

  // Extract specific filters from the filter string
  const searchMatch = filters.match(/title\s*==\s*"([^"]+)"/);
  const search = searchMatch?.[1] ?? null;

  const categoryMatch = filters.match(
    /category->slug\.current\s*==\s*"([^"]+)"/,
  );
  const category = categoryMatch?.[1] ?? null;

  const orderMatch = query.match(/\|\s*order\(([^)]+)\)/);
  const order = orderMatch?.[1] ?? null;

  return { start, end, search, category, order };
}

/**
 * Retrieve paginated articles
 */
function retrieveArticles(url: URL, query: string) {
  const { start, end, search, category, order } = extractPaginationParams(
    url,
    query,
  );

  let filteredArticles = articles.filter((a) => a.published);

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm) ||
        a.content.toLowerCase().includes(searchTerm),
    );
  }

  if (category) {
    filteredArticles = filteredArticles.filter(
      (a) => a.category.slug === category,
    );
  }

  if (order) {
    filteredArticles.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === "createdAt asc" ? dateA - dateB : dateB - dateA;
    });
  }

  const featuredArticles = filteredArticles.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  const paginatedArticles = regularArticles.slice(start, end);

  return HttpResponse.json({
    result: {
      articles: [...paginatedArticles, ...featuredArticles],
      total: regularArticles.length,
    },
  });
}

/**
 * Retrieve a single article by slug from the mock data
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function retrieveArticleBySlug(url: URL) {
  const slug = url.searchParams.get("$slug");

  if (!slug) {
    return new HttpResponse(
      JSON.stringify({ error: "Slug parameter is required" }),
      { status: StatusCodes.BAD_REQUEST },
    );
  }
  const article = articles.find((a) => a.slug === slug.replace(/["']/g, ""));
  if (!article) {
    return new HttpResponse(JSON.stringify({ error: "Article not found" }), {
      status: StatusCodes.NOT_FOUND,
    });
  }

  return HttpResponse.json({
    result: {
      ...article,
      content: (await readPageContent("test-article")) as string,
      category: article?.category ?? null,
      tags: article?.tags ?? [],
    },
  });
}

/**
 * Retrieve related articles based on the current article's tags and category
 */
function retrieveRelatedArticles(url: URL) {
  const slug = url.searchParams.get("$slug");
  const currentArticle = articles.find(
    (a) => a.slug === slug?.replace(/["']/g, ""),
  );

  const relatedArticles =
    articles
      .filter(
        (article) =>
          (article.tags.some((tag) =>
            currentArticle?.tags.some(
              (currentTag) => currentTag.slug === tag.slug,
            ),
          ) ||
            article.category.slug === currentArticle?.category.slug) &&
          article.slug !== currentArticle?.slug,
      )
      .slice(0, 3) ?? [];

  return HttpResponse.json({
    result: relatedArticles,
  });
}

/**
 * Retrive recent articles from the mock data
 */
function retrieveRecentArticles() {
  return HttpResponse.json({
    result: articles
      .filter((article) => article.published === true)
      .slice(0, 4)
      .map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        createdAt: article.createdAt,
        category: article.category,
        image: article.image,
        excerpt: article.excerpt,
      })),
  });
}

/**
 * Retrieve tags from the mock data
 */
function retrieveTags() {
  return HttpResponse.json({
    result: articles
      .flatMap((article) => article.tags)
      .map((tag) => ({
        id: tag.id,
        title: tag.title,
        slug: tag.slug,
      }))
      .filter(
        (tag, index, self) =>
          index === self.findIndex((t) => t.slug === tag.slug),
      ),
  });
}

/**
 * Retrieve categories from the mock data
 */

function retrieveCategories() {
  return HttpResponse.json({
    result: articles
      .flatMap((article) => article.tags)
      .map((tag) => ({
        id: tag.id,
        title: tag.title,
        slug: tag.slug,
      }))
      .filter(
        (tag, index, self) =>
          index === self.findIndex((t) => t.slug === tag.slug),
      ),
  });
}
