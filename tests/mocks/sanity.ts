/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { http, HttpResponse, passthrough, type HttpHandler } from "msw";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { StatusCodes } from "http-status-codes";
import { SANITY_API_URL } from "~/services.server/sanity/loader";
import {
  articleDetailsQuery,
  articlesQuery,
  categoryQuery,
  countQuery,
  recentArticlesQuery,
  relatedQuery,
  tagQuery,
} from "~/services.server/sanity/articles/queries";
import { readMdxDirectory, readPageContent } from "~/utils/misc.server";

// Types
interface Article {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
  published: boolean;
  featured: boolean;
  image: string;
  excerpt: string;
  content: string;
  sandpackTemplates?: any[];
  reactComponents?: any[];
}

// Cache for articles to avoid repeated file reads
let articlesCache: Article[] | null = null;

async function getArticles(): Promise<Article[]> {
  if (articlesCache) {
    return articlesCache;
  }

  try {
    // Get all MDX files in the articles directory
    const articlesDir = path.join(process.cwd(), "content/pages", "articles");
    const files = await fs.readdir(articlesDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log("Found MDX files:", mdxFiles.length);

    const articles = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent(`articles/${slug}`);

          if (!content) {
            console.warn(`No content found for: ${slug}`);
            return null;
          }

          // Parse frontmatter using gray-matter
          const { data: frontmatter, content: markdownContent } =
            matter(content);

          return {
            ...frontmatter,
            slug,
            content: markdownContent,
          } as Article;
        } catch (error) {
          console.error(`Error processing article ${file}:`, error);
          return null;
        }
      }),
    );

    articlesCache = articles.filter(Boolean) as Article[];
    console.log("Processed articles:", articlesCache.length);
    return articlesCache;
  } catch (error) {
    console.error("Error loading articles:", error);
    return [];
  }
}

// Utility functions
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error occurred";
}

function normalizeQuery(query: string): string {
  return query
    .replace(/\s+/g, " ")
    .replace(/\s*([=!<>]+)\s*/g, "$1")
    .trim();
}

const matchStrategies = {
  exact: (received: string, expected: string) =>
    normalizeQuery(received) === normalizeQuery(expected),

  pattern: (received: string, pattern: string) => {
    const receivedNorm = normalizeQuery(received);
    const patternNorm = normalizeQuery(pattern);

    const regexPattern = patternNorm
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\\$\w+/g, '[^"\\s]+');

    return new RegExp(`^${regexPattern}$`).test(receivedNorm);
  },

  contains: (received: string, fragment: string) =>
    normalizeQuery(received).includes(normalizeQuery(fragment)),

  parsed: (received: string) => {
    const typeMatch = received.match(/_type\s*==\s*"([^"]+)"/);
    const publishedMatch = received.match(/published\s*==\s*(true|false)/);
    const slugMatch = received.match(/slug\.current\s*==\s*\$(\w+)/);

    return {
      type: typeMatch?.[1],
      published: publishedMatch?.[1] === "true",
      hasSlugParam: !!slugMatch,
      slugParam: slugMatch?.[1],
    };
  },
};

// Mock data handlers
async function handleArticlesQuery(url: URL, query: string) {
  const search = url.searchParams.get("$search")?.replace(/\*/g, "");
  const category = url.searchParams.get("$category");
  const tag = url.searchParams.get("$tag");
  const start = Math.max(0, Number(url.searchParams.get("$start") ?? 0));
  const end = Number(url.searchParams.get("$end") ?? start + 6);

  const articles = await getArticles();
  let filteredArticles = articles.filter((a) => a.published);

  // Apply search filter
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm) ||
        a.excerpt.toLowerCase().includes(searchTerm) ||
        a.content.toLowerCase().includes(searchTerm),
    );
  }

  // Apply category filter
  if (category) {
    filteredArticles = filteredArticles.filter(
      (a) => a.category.slug === category,
    );
  }

  // Apply tag filter
  if (tag) {
    filteredArticles = filteredArticles.filter((a) =>
      a.tags.some((t) => t.slug === tag),
    );
  }

  // Apply ordering (assuming createdAt desc by default)
  filteredArticles.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // desc order
  });

  // Apply pagination
  const paginatedArticles = filteredArticles.slice(start, end);

  return {
    articles: paginatedArticles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      createdAt: article.createdAt,
      category: article.category,
      tags: article.tags,
      published: article.published,
      featured: article.featured,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
    })),
    total: filteredArticles.length,
  };
}

async function handleCountQuery() {
  const articles = await getArticles();
  return articles.filter((a) => a.published).length;
}

async function handleArticleDetailsQuery(url: URL) {
  const slug = url.searchParams.get("$slug");

  if (!slug) {
    throw new Error("Slug parameter is required");
  }

  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug.replace(/["']/g, ""));

  if (!article) {
    throw new Error("Article not found");
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    createdAt: article.createdAt,
    category: article.category,
    tags: article.tags,
    published: article.published,
    image: article.image,
    excerpt: article.excerpt,
    content: article.content,
    sandpackTemplates: article.sandpackTemplates || [],
    reactComponents: article.reactComponents || [],
  };
}

async function handleRelatedQuery(url: URL) {
  const slug = url.searchParams.get("$slug");
  const tagIds = url.searchParams.get("$tagIds")?.split(",") || [];
  const categoryId = url.searchParams.get("$categoryId");

  const articles = await getArticles();

  const currentArticle = articles.find(
    (a) => a.slug === slug?.replace(/["']/g, ""),
  );

  if (!currentArticle) {
    return [];
  }

  const relatedArticles = articles
    .filter((article) => {
      if (!article.published || article.slug === currentArticle.slug) {
        return false;
      }

      // Check if article shares tags or category
      const hasSharedTags = article.tags.some((tag) =>
        currentArticle.tags.some((currentTag) => currentTag.id === tag.id),
      );

      const sameCategory = article.category.id === currentArticle.category.id;

      return hasSharedTags || sameCategory;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3)
    .map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      createdAt: article.createdAt,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
    }));

  return relatedArticles;
}

async function handleRecentArticlesQuery(url: URL) {
  const limit = Number(url.searchParams.get("$limit") ?? 4);

  const articles = await getArticles();

  return articles
    .filter((article) => article.published)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit)
    .map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      createdAt: article.createdAt,
      category: article.category,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
    }));
}

async function handleTagQuery(url: URL) {
  const limit = Number(url.searchParams.get("$limit") ?? 10);

  // Get all unique tags and count their usage
  const tagCounts = new Map();
  const articles = await getArticles();

  articles
    .filter((article) => article.published)
    .forEach((article) => {
      article.tags.forEach((tag) => {
        const count = tagCounts.get(tag.id) || 0;
        tagCounts.set(tag.id, count + 1);
      });
    });

  // Get unique tags with their counts
  const tagsWithCount = Array.from(
    new Map(
      articles.flatMap((article) => article.tags).map((tag) => [tag.id, tag]),
    ).values(),
  )
    .map((tag) => ({
      id: tag.id,
      title: tag.title,
      slug: tag.slug,
      count: tagCounts.get(tag.id) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return tagsWithCount;
}

async function handleCategoryQuery() {
  // Get unique categories
  const articles = await getArticles();
  const uniqueCategories = Array.from(
    new Map(
      articles
        .map((article) => article.category)
        .map((category) => [category.id, category]),
    ).values(),
  ).map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
  }));

  return uniqueCategories;
}

// Query handler interface
interface QueryHandler {
  name: string;
  match: (query: string) => boolean;

  handle: (query: string, url: URL) => Promise<any> | any;
  priority?: number;
}

const queryHandlers: QueryHandler[] = [
  // 1. Exact matches (highest priority)
  {
    name: "count-query",
    priority: 100,
    match: (q) => matchStrategies.exact(q, countQuery),
    handle: async () => handleCountQuery(),
  },

  {
    name: "article-details-query",
    priority: 95,
    match: (q) => matchStrategies.pattern(q, articleDetailsQuery),
    handle: async (q, url) => handleArticleDetailsQuery(url),
  },

  {
    name: "related-query",
    priority: 90,
    match: (q) => matchStrategies.pattern(q, relatedQuery),
    handle: async (q, url) => handleRelatedQuery(url),
  },

  {
    name: "tag-query",
    priority: 85,
    match: (q) => matchStrategies.pattern(q, tagQuery),
    handle: async (q, url) => handleTagQuery(url),
  },

  {
    name: "category-query",
    priority: 80,
    match: (q) => matchStrategies.exact(q, categoryQuery),
    handle: async () => handleCategoryQuery(),
  },

  {
    name: "recent-articles-query",
    priority: 75,
    match: (q) => matchStrategies.pattern(q, recentArticlesQuery()),
    handle: async (q, url) => handleRecentArticlesQuery(url),
  },

  // 2. Pattern-based matches for dynamic queries
  {
    name: "articles-query",
    priority: 50,
    match: (q) => {
      // Check if it's the articlesQuery pattern
      return (
        q.includes('"articles":') &&
        q.includes('_type == "article"') &&
        q.includes("published == true") &&
        q.includes('"total": count(*')
      );
    },
    handle: async (q, url) => handleArticlesQuery(url, q),
  },

  // 3. Fallback for sandpack
  {
    name: "sandpack-fallback",
    priority: 10,
    match: (q) => matchStrategies.contains(q, '_type == "sandpack"'),
    handle: async () => passthrough(),
  },
];

// Main handler implementation
export const handlers: HttpHandler[] = [
  http.get(SANITY_API_URL, async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) {
      return HttpResponse.json(
        { error: "Query parameter is required" },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    // Sort handlers by priority (highest first)
    const sortedHandlers = [...queryHandlers].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0),
    );

    for (const handler of sortedHandlers) {
      if (handler.match(query)) {
        try {
          console.log(`Handling query with: ${handler.name}`);
          const result = await handler.handle(query, url);

          // Handle passthrough responses
          if (
            result &&
            typeof result === "object" &&
            result.constructor.name === "MockedResponse"
          ) {
            return result;
          }

          return HttpResponse.json({ result });
        } catch (error: unknown) {
          console.error(`Error in handler ${handler.name}:`, error);
          return HttpResponse.json(
            {
              error: "Handler Error",
              message: getErrorMessage(error),
              handler: handler.name,
            },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
          );
        }
      }
    }

    console.warn(`No handler found for query: ${query}`);
    return HttpResponse.json(
      {
        error: "Not Found",
        message: `No mock handler for query: ${query}`,
        suggestedHandlers: queryHandlers.map((h) => h.name),
        normalizedQuery: normalizeQuery(query),
      },
      { status: StatusCodes.NOT_FOUND },
    );
  }),
];

// Clear cache function for development
export function clearArticlesCache() {
  articlesCache = null;
}
