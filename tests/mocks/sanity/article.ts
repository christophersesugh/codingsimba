import {
  countQuery,
  recentArticlesQuery,
} from "~/utils/content.server/articles/queries";
import { articleDetailsQuery } from "~/utils/content.server/articles/queries";
import { articleIdQuery } from "~/utils/content.server/articles/queries";
import { categoryQuery } from "~/utils/content.server/shared-queries";
import { relatedQuery } from "~/utils/content.server/articles/queries";
import { tagQuery } from "~/utils/content.server/articles/queries";
import type {
  SanityTag,
  SanityCategory,
  SanityAuthor,
  SanitySandpackTemplate,
  SanityReactComponent,
  QueryHandler,
  FilterOptions,
} from "./utils";
import {
  matchStrategies,
  getContentFromDirectory,
  getTagsFromDirectory,
  getCategoriesFromDirectory,
  getAuthorsFromDirectory,
  ContentCache,
} from "./utils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Base content interface for articles
 */
export interface SanityArticle {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  categoryId: string;
  tags: SanityTag[];
  authorId: string;
  published: boolean;
  featured?: boolean;
  image: string;
  excerpt: string;
  content: string;
  sandpackTemplates?: SanitySandpackTemplate[];
  reactComponents?: SanityReactComponent[];
}

/**
 * Fully resolved article with all references populated
 * This is what gets returned to the client
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  categoryId: string;
  authorId: string;
  published: boolean;
  featured?: boolean;
  image: string;
  excerpt: string;
  content: string;
  sandpackTemplates?: SanitySandpackTemplate[];
  reactComponents?: SanityReactComponent[];
  category: SanityCategory;
  author: SanityAuthor;
  tags: SanityTag[];
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * In-memory cache for articles to avoid repeated file system reads
 */
const articleCache = new ContentCache<SanityArticle>();

/**
 * Clears the article cache for development and testing
 */
export function clearArticleCache(): void {
  articleCache.clear();
}

// ============================================================================
// CONTENT LOADING UTILITIES
// ============================================================================

/**
 * Loads articles from MDX files in the fixtures directory
 */
export async function getArticlesFromDirectory(): Promise<SanityArticle[]> {
  return articleCache.getOrLoad("articles", () =>
    getContentFromDirectory<SanityArticle>("articles"),
  );
}

/**
 * Filters and paginates articles based on provided options
 */
export function filterArticles(
  articles: SanityArticle[],
  options: FilterOptions,
): { articles: SanityArticle[]; total: number } {
  let filteredArticles = articles.filter((item) =>
    options.published !== undefined
      ? item.published === options.published
      : true,
  );

  // Apply featured filter
  if (options.featured !== undefined) {
    filteredArticles = filteredArticles.filter(
      (item) => item.featured === options.featured,
    );
  }

  // Apply search filter
  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm),
    );
  }

  // Apply category filter
  if (options.category) {
    filteredArticles = filteredArticles.filter(
      (item) => item.categoryId === options.category,
    );
  }

  // Apply tag filter
  if (options.tag) {
    filteredArticles = filteredArticles.filter((item) =>
      item.tags.some((t) => t.slug === options.tag),
    );
  }

  // Apply sorting
  if (options.order) {
    if (/createdAt\s+desc/i.test(options.order)) {
      filteredArticles.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else if (/createdAt\s+asc/i.test(options.order)) {
      filteredArticles.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
    }
  }

  const start = Math.max(0, options.start ?? 0);
  const end = options.end ?? start + (options.pageSize ?? 6);
  const pageSize = end - start;
  const paginatedArticles = filteredArticles.slice(start, start + pageSize);

  return {
    articles: paginatedArticles,
    total: filteredArticles.length,
  };
}

/**
 * Extracts unique tags from articles
 */
export async function getUniqueTagsFromArticles(
  articles: SanityArticle[],
): Promise<SanityTag[]> {
  const uniqueTags = new Map<string, SanityTag>();
  const tags = await getTagsFromDirectory();
  articles
    .filter((item) => item.published)
    .forEach((item) => {
      item.tags.forEach((tag) => {
        const foundTag = tags.find((t) => t.id === tag.id);
        if (foundTag && !uniqueTags.has(foundTag.id)) {
          uniqueTags.set(foundTag.id, foundTag);
        }
      });
    });

  return Array.from(uniqueTags.values());
}

// ============================================================================
// REFERENCE RESOLUTION
// ============================================================================

/**
 * Resolves references for a single article
 * Converts SanityArticle to Article with populated author, category, and tags
 */
export async function resolveArticleReferences(
  article: SanityArticle,
): Promise<Article> {
  const [authors, categories, tags] = await Promise.all([
    getAuthorsFromDirectory(),
    getCategoriesFromDirectory(),
    getTagsFromDirectory(),
  ]);

  const author = authors.find((a) => a.id === article.authorId);
  const category = categories.find((c) => c.id === article.categoryId);
  const resolvedTags = (article.tags || [])
    .map((t: SanityTag) => tags.find((tag) => tag.id === t.id))
    .filter((tag): tag is SanityTag => tag !== undefined);

  if (!author || !category) {
    throw new Error(`Missing author or category for article ${article.id}`);
  }

  return {
    ...article,
    author,
    category,
    tags: resolvedTags,
  };
}

/**
 * Resolves references for multiple articles
 */
export async function resolveArticlesReferences(
  articles: SanityArticle[],
): Promise<Article[]> {
  return Promise.all(articles.map(resolveArticleReferences));
}

// ============================================================================
// ARTICLE QUERY RESOLVERS
// ============================================================================

/**
 * Handles resolution of references for article content items
 */
export class ArticleQueryResolver {
  /**
   * Loads all articles from the fixtures
   */
  static async getArticles() {
    return await getArticlesFromDirectory();
  }

  /**
   * Counts all articles
   */
  static async countArticles() {
    const articles = await ArticleQueryResolver.getArticles();
    return articles.length;
  }

  /**
   * Handles queries for related articles based on shared tags or category
   */
  static async handleRelatedQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const articles = await ArticleQueryResolver.getArticles();
    const currentArticle = articles.find(
      (a) => a.slug === slug?.replace(/["']/g, ""),
    );
    const relatedArticles = articles
      .filter((a) => {
        if (!a.published || a.slug === currentArticle?.slug) {
          return false;
        }
        const hasSharedTags = (a.tags || []).some((tag: SanityTag) =>
          (currentArticle?.tags || []).some(
            (currentTag: SanityTag) => currentTag.id === tag.id,
          ),
        );
        const sameCategory = a.categoryId === currentArticle?.categoryId;
        return hasSharedTags || sameCategory;
      })
      .slice(0, 3);
    return resolveArticlesReferences(relatedArticles);
  }

  /**
   * Handles queries for popular tags with usage counts
   */
  static async handleTagQuery(url: URL) {
    const limit = Number(url.searchParams.get("$limit") ?? 10);
    const articles = await ArticleQueryResolver.getArticles();
    const tagsWithCount = (await getUniqueTagsFromArticles(articles)).slice(
      0,
      limit,
    );
    return tagsWithCount;
  }

  /**
   * Handles queries for all categories
   */
  static async handleCategoryQuery() {
    return getCategoriesFromDirectory();
  }

  /**
   * Handles queries for recent articles
   */
  static async handleRecentArticlesQuery(url: URL) {
    const limit = Number(url.searchParams.get("$limit") ?? 4);
    const articles = await ArticleQueryResolver.getArticles();
    const recentArticles = articles
      .filter((a) => a.published)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
    return resolveArticlesReferences(recentArticles);
  }

  /**
   * Handles queries for featured articles
   */
  static async handleFeaturedArticleQuery() {
    const articles = await ArticleQueryResolver.getArticles();
    const featuredArticle = articles.find(
      (article) => article.featured && article.published,
    );

    if (!featuredArticle) return null;

    return resolveArticleReferences(featuredArticle);
  }

  /**
   * Handles queries for article count
   */
  static async handleCountQuery() {
    const articles = await ArticleQueryResolver.getArticles();
    return articles.filter((a) => a.published).length;
  }

  /**
   * Handles queries for articles by ID/slug
   */
  static async handleArticleIdQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const articles = await ArticleQueryResolver.getArticles();
    const article = articles.find((a) => a.slug === slug?.replace(/["']/g, ""));
    if (!article) {
      throw new Error("Article not found");
    }
    return resolveArticleReferences(article);
  }

  /**
   * Handles queries for filtered and paginated articles
   */
  static async handleArticlesQuery(url: URL) {
    const search =
      url.searchParams.get("$search")?.replace(/\*/g, "") || undefined;
    const category = url.searchParams.get("$category") || undefined;
    const tag = url.searchParams.get("$tag") || undefined;
    const order = url.searchParams.get("$order") || "createdAt desc";
    const start = Math.max(0, Number(url.searchParams.get("$start") ?? 0));
    const end = Number(url.searchParams.get("$end") ?? start + 6);
    const pageSize = end - start;
    const articles = await ArticleQueryResolver.getArticles();

    // Resolve all articles first
    const resolvedArticles = await resolveArticlesReferences(articles);

    const result = filterArticles(resolvedArticles, {
      search,
      category,
      tag,
      start,
      end,
      pageSize,
      order,
    });

    return {
      articles: result.articles,
      total: result.total,
    };
  }

  /**
   * Handles queries for article details
   */
  static async handleArticleDetailsQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const articles = await ArticleQueryResolver.getArticles();
    const article = articles.find((a) => a.slug === slug?.replace(/["']/g, ""));

    if (!article) {
      throw new Error("Article not found");
    }
    return resolveArticleReferences(article);
  }
}

// ============================================================================
// ARTICLE QUERY HANDLER REGISTRY
// ============================================================================

/**
 * Registry of all article query handlers
 * Handlers are matched in order of priority (highest first)
 */
export const articleQueryHandler: QueryHandler[] = [
  {
    name: "article-id-query",
    priority: 95,
    match: (q: string) => matchStrategies.pattern(q, articleIdQuery),
    handle: async (url: URL) => ArticleQueryResolver.handleArticleIdQuery(url),
  },
  {
    name: "articles-query",
    priority: 50,
    match: (q: string) => {
      return (
        q.includes('"articles":') &&
        q.includes('_type == "article"') &&
        q.includes("published == true") &&
        q.includes('"total": count(*')
      );
    },
    handle: async (url: URL) => ArticleQueryResolver.handleArticlesQuery(url),
  },
  {
    name: "count-query",
    priority: 50,
    match: (q: string) => matchStrategies.exact(q, countQuery),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle: async (_: URL) => ArticleQueryResolver.handleCountQuery(),
  },
  {
    name: "article-details-query",
    priority: 95,
    match: (q: string) => matchStrategies.pattern(q, articleDetailsQuery),
    handle: async (url: URL) =>
      ArticleQueryResolver.handleArticleDetailsQuery(url),
  },
  {
    name: "related-query",
    priority: 90,
    match: (q: string) => matchStrategies.pattern(q, relatedQuery),
    handle: async (url: URL) => ArticleQueryResolver.handleRelatedQuery(url),
  },
  {
    name: "tag-query",
    priority: 85,
    match: (q: string) => matchStrategies.pattern(q, tagQuery),
    handle: async (url: URL) => ArticleQueryResolver.handleTagQuery(url),
  },
  {
    name: "category-query",
    priority: 80,
    match: (q: string) => matchStrategies.exact(q, categoryQuery),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle: async (_: URL) => ArticleQueryResolver.handleCategoryQuery(),
  },
  {
    name: "recent-articles-query",
    priority: 75,
    match: (q: string) => matchStrategies.pattern(q, recentArticlesQuery()),
    handle: async (url: URL) =>
      ArticleQueryResolver.handleRecentArticlesQuery(url),
  },
  {
    name: "featured-article",
    priority: 85,
    match: (q: string) => matchStrategies.contains(q, "featured == true"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle: async (_: URL) => ArticleQueryResolver.handleFeaturedArticleQuery(),
  },
];
