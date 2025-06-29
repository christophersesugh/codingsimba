import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { StatusCodes } from "http-status-codes";
import { http, HttpHandler, HttpResponse } from "msw";
import { SANITY_API_URL } from "~/utils/content.server/loader";
import { authorArticlesQuery } from "~/utils/content.server/authors/queries";
import { authorDetailsQuery } from "~/utils/content.server/authors/queries";
import { recentArticlesQuery } from "~/utils/content.server/articles/queries";
import { articleDetailsQuery } from "~/utils/content.server/articles/queries";
import { articleIdQuery } from "~/utils/content.server/articles/queries";
import { categoryQuery } from "~/utils/content.server/articles/queries";
import { relatedQuery } from "~/utils/content.server/articles/queries";
import { tagQuery } from "~/utils/content.server/articles/queries";
import { readPageContent } from "~/utils/misc.server";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Base content interface for all Sanity content types
 * Used as the foundation for articles, tutorials, programs, etc.
 */
export interface SanityContent {
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
 * Author information for content creators
 */
export interface SanityAuthor {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
  skills: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: string;
}

/**
 * Category classification for content
 */
export interface SanityCategory {
  id: string;
  title: string;
  slug: string;
}

/**
 * Tag system for content organization
 */
export interface SanityTag {
  id: string;
  title: string;
  slug: string;
}

/**
 * Sandpack template for interactive code examples
 */
export interface SanitySandpackTemplate {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  framework: string;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * React component for embedded functionality
 */
export interface SanityReactComponent {
  id: string;
  name: string;
  code: string;
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
 * In-memory cache for content to avoid repeated file system reads
 * Key: content type (e.g., "articles", "authors")
 * Value: array of content items
 */
const contentCache = new Map<string, SanityContent[]>();

/**
 * Clears the content cache for development and testing
 * @param contentType - Optional specific content type to clear
 */
export function clearContentCache(contentType?: string): void {
  if (contentType) {
    contentCache.delete(contentType);
  } else {
    contentCache.clear();
  }
}

// ============================================================================
// CONTENT LOADING UTILITIES
// ============================================================================

/**
 * Loads content from MDX files in the fixtures directory
 * @param contentType - The type of content to load (e.g., "articles", "authors")
 * @returns Promise<SanityContent[]> - Array of parsed content items
 */
export async function getContentFromDirectory(
  contentType: string,
): Promise<SanityContent[]> {
  const cacheKey = contentType;

  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }

  try {
    const contentDir = path.join(
      process.cwd(),
      "tests/fixtures/sanity",
      contentType,
    );
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`Found MDX files for ${contentType}:`, mdxFiles.length);

    const content = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent({
            basePath: "tests/fixtures/sanity",
            pageName: `${contentType}/${slug}`,
          });

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
          } as SanityContent;
        } catch (error) {
          console.error(`Error processing ${contentType} ${file}:`, error);
          return null;
        }
      }),
    );

    const validContent = content.filter(Boolean) as SanityContent[];
    contentCache.set(cacheKey, validContent);
    console.log(`Processed ${contentType}:`, validContent.length);
    return validContent;
  } catch (error) {
    console.error(`Error loading ${contentType}:`, error);
    return [];
  }
}

// ============================================================================
// QUERY MATCHING UTILITIES
// ============================================================================

/**
 * Normalizes GROQ queries for consistent matching
 * @param query - The GROQ query string to normalize
 * @returns string - Normalized query string
 */
export function normalizeQuery(query: string): string {
  return query
    .replace(/\s+/g, " ")
    .replace(/\s*([=!<>]+)\s*/g, "$1")
    .trim();
}

/**
 * Strategies for matching GROQ queries to handlers
 */
export const matchStrategies = {
  /**
   * Exact string matching after normalization
   */
  exact: (received: string, expected: string) =>
    normalizeQuery(received) === normalizeQuery(expected),

  /**
   * Pattern matching with parameter substitution
   */
  pattern: (received: string, pattern: string) => {
    const receivedNorm = normalizeQuery(received);
    const patternNorm = normalizeQuery(pattern);

    const regexPattern = patternNorm
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\\$\w+/g, '[^"\\s]+');
    return new RegExp(`^${regexPattern}$`).test(receivedNorm);
  },

  /**
   * Contains matching for partial query matching
   */
  contains: (received: string, fragment: string) =>
    normalizeQuery(received).includes(normalizeQuery(fragment)),

  /**
   * Parses query to extract type, published status, and slug parameters
   */
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

// ============================================================================
// CONTENT FILTERING UTILITIES
// ============================================================================

/**
 * Options for filtering content
 */
export interface FilterOptions {
  search?: string;
  category?: string;
  tag?: string;
  start?: number;
  end?: number;
  pageSize?: number;
  order?: string;
  published?: boolean;
  featured?: boolean;
}

/**
 * Filters and paginates content based on provided options
 * @param content - Array of content items to filter
 * @param options - Filtering and pagination options
 * @returns Object with filtered content and total count
 */
export function filterContent(
  content: SanityContent[],
  options: FilterOptions,
): { content: SanityContent[]; total: number } {
  let filteredContent = content.filter((item) =>
    options.published !== undefined
      ? item.published === options.published
      : true,
  );

  // Apply featured filter
  if (options.featured !== undefined) {
    filteredContent = filteredContent.filter(
      (item) => item.featured === options.featured,
    );
  }

  // Apply search filter
  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    filteredContent = filteredContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm),
    );
  }

  // Apply category filter
  if (options.category) {
    filteredContent = filteredContent.filter(
      (item) => item.categoryId === options.category,
    );
  }

  // Apply tag filter
  if (options.tag) {
    filteredContent = filteredContent.filter((item) =>
      item.tags.some((t) => t.slug === options.tag),
    );
  }

  // Apply sorting
  if (options.order) {
    if (/createdAt\s+desc/i.test(options.order)) {
      filteredContent.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else if (/createdAt\s+asc/i.test(options.order)) {
      filteredContent.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
    }
  }

  const start = Math.max(0, options.start ?? 0);
  const end = options.end ?? start + (options.pageSize ?? 6);
  const pageSize = end - start;
  const paginatedContent = filteredContent.slice(start, start + pageSize);

  return {
    content: paginatedContent,
    total: filteredContent.length,
  };
}

/**
 * Extracts unique tags from content
 * @param content - Array of content items
 * @returns Array of unique tags
 */
export async function getUniqueTags(
  content: SanityContent[],
): Promise<SanityTag[]> {
  const uniqueTags = new Map<string, SanityTag>();
  const tags = await QueryHandlers.getTags();
  content
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
// QUERY HANDLER INTERFACE
// ============================================================================

/**
 * Interface for query handlers that process GROQ queries
 */
export interface QueryHandler {
  name: string;
  match: (query: string) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (url: URL) => Promise<any> | any;
  priority?: number;
}

// ============================================================================
// CONTENT RESOLUTION HANDLERS
// ============================================================================

/**
 * Handles resolution of references for content items
 * Converts raw SanityContent to fully resolved Article objects
 */
class QueryHandlers {
  /**
   * Loads all authors from the fixtures
   */
  static async getAuthors() {
    return (await getContentFromDirectory(
      "authors",
    )) as unknown as SanityAuthor[];
  }

  /**
   * Loads all tags from the fixtures
   */
  static async getTags() {
    return (await getContentFromDirectory("tags")) as unknown as SanityTag[];
  }

  /**
   * Loads all categories from the fixtures
   */
  static async getCategories() {
    return (await getContentFromDirectory(
      "categories",
    )) as unknown as SanityCategory[];
  }

  /**
   * Loads all articles from the fixtures
   */
  static async getArticles() {
    return (await getContentFromDirectory(
      "articles",
    )) as unknown as SanityContent[];
  }

  /**
   * Resolves references for a single article
   * Converts SanityContent to Article with populated author, category, and tags
   */
  static async resolveArticleReferences(
    article: SanityContent,
  ): Promise<Article> {
    const [authors, categories, tags] = await Promise.all([
      QueryHandlers.getAuthors(),
      QueryHandlers.getCategories(),
      QueryHandlers.getTags(),
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
  static async resolveArticlesReferences(
    articles: SanityContent[],
  ): Promise<Article[]> {
    return Promise.all(articles.map(QueryHandlers.resolveArticleReferences));
  }

  // ============================================================================
  // ARTICLE QUERY HANDLERS
  // ============================================================================

  /**
   * Handles queries for related articles based on shared tags or category
   */
  static async handleRelatedQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const articles = await QueryHandlers.getArticles();
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
    return QueryHandlers.resolveArticlesReferences(relatedArticles);
  }

  /**
   * Handles queries for popular tags with usage counts
   */
  static async handleTagQuery(url: URL) {
    const limit = Number(url.searchParams.get("$limit") ?? 10);
    const articles = await QueryHandlers.getArticles();
    const tagsWithCount = (await getUniqueTags(articles)).slice(0, limit);
    return tagsWithCount;
  }

  /**
   * Handles queries for all categories
   */
  static async handleCategoryQuery() {
    return QueryHandlers.getCategories();
  }

  /**
   * Handles queries for recent articles
   */
  static async handleRecentArticlesQuery(url: URL) {
    const limit = Number(url.searchParams.get("$limit") ?? 4);
    const articles = await QueryHandlers.getArticles();
    const recentArticles = articles
      .filter((a) => a.published)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
    return QueryHandlers.resolveArticlesReferences(recentArticles);
  }

  /**
   * Handles queries for featured articles
   */
  static async handleFeaturedArticleQuery() {
    const articles = await QueryHandlers.getArticles();
    const featuredArticle = articles.find(
      (article) => article.featured && article.published,
    );

    if (!featuredArticle) return null;

    return QueryHandlers.resolveArticleReferences(featuredArticle);
  }

  /**
   * Handles queries for article count
   */
  static async handleCountQuery() {
    const articles = await QueryHandlers.getArticles();
    return articles.filter((a) => a.published).length;
  }

  /**
   * Handles queries for articles by ID/slug
   */
  static async handleArticleIdQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const articles = await QueryHandlers.getArticles();
    const article = articles.find((a) => a.slug === slug?.replace(/["']/g, ""));
    if (!article) {
      throw new Error("Article not found");
    }
    return QueryHandlers.resolveArticleReferences(article);
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
    const articles = await QueryHandlers.getArticles();

    // Resolve all articles first
    const resolvedArticles =
      await QueryHandlers.resolveArticlesReferences(articles);

    const result = filterContent(resolvedArticles, {
      search,
      category,
      tag,
      start,
      end,
      pageSize,
      order,
    });

    return {
      articles: result.content,
      total: result.total,
    };
  }

  /**
   * Handles queries for article details
   */
  static async handleArticleDetailsQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const articles = await QueryHandlers.getArticles();
    const article = articles.find((a) => a.slug === slug?.replace(/["']/g, ""));

    if (!article) {
      throw new Error("Article not found");
    }
    return QueryHandlers.resolveArticleReferences(article);
  }

  // ============================================================================
  // AUTHOR QUERY HANDLERS
  // ============================================================================

  /**
   * Handles queries for author details by slug
   */
  static async handleAuthorDetailsQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const authors = await QueryHandlers.getAuthors();
    const author = authors.find((a) => a.slug === slug?.replace(/["']/g, ""));
    if (!author) {
      throw new Error("Author not found");
    }
    return author;
  }

  /**
   * Handles queries for articles by a specific author
   */
  static async handleAuthorArticlesQuery(url: URL) {
    const authorSlug = url.searchParams.get("$slug");
    if (!authorSlug) {
      throw new Error("Author slug parameter is required");
    }

    const authors = await QueryHandlers.getAuthors();
    const author = authors.find(
      (a) => a.slug === authorSlug.replace(/["']/g, ""),
    );
    if (!author) {
      throw new Error("Author not found");
    }

    const articles = await QueryHandlers.getArticles();
    const authorArticles = articles.filter(
      (article) => article.authorId === author.id,
    );

    return QueryHandlers.resolveArticlesReferences(authorArticles);
  }

  // ============================================================================
  // FUTURE MODULE HANDLERS
  // ============================================================================

  /**
   * TODO: Add tutorial query handlers
   * - handleTutorialDetailsQuery
   * - handleTutorialsQuery
   * - handleTutorialLessonsQuery
   */

  /**
   * TODO: Add program query handlers
   * - handleProgramDetailsQuery
   * - handleProgramsQuery
   * - handleProgramModulesQuery
   */

  /**
   * TODO: Add course query handlers
   * - handleCourseDetailsQuery
   * - handleCoursesQuery
   * - handleCourseLessonsQuery
   */

  /**
   * TODO: Add module query handlers
   * - handleModuleDetailsQuery
   * - handleModulesQuery
   * - handleModuleSubModulesQuery
   */

  /**
   * TODO: Add sub module query handlers
   * - handleSubModuleDetailsQuery
   * - handleSubModulesQuery
   * - handleSubModuleLessonsQuery
   */

  /**
   * TODO: Add lesson query handlers
   * - handleLessonDetailsQuery
   * - handleLessonsQuery
   * - handleLessonChallengesQuery
   */

  /**
   * TODO: Add challenge query handlers
   * - handleChallengeDetailsQuery
   * - handleChallengesQuery
   * - handleChallengeSubmissionsQuery
   */
}

// ============================================================================
// QUERY HANDLER REGISTRY
// ============================================================================

/**
 * Registry of all query handlers organized by content type
 * Handlers are matched in order of priority (highest first)
 */
export const queryHandlers: QueryHandler[] = [
  // Author handlers (highest priority)
  {
    name: "author-details-query",
    priority: 100,
    match: (q: string) => matchStrategies.pattern(q, authorDetailsQuery),
    handle: async (url: URL) => QueryHandlers.handleAuthorDetailsQuery(url),
  },
  {
    name: "author-articles-query",
    priority: 95,
    match: (q: string) => matchStrategies.pattern(q, authorArticlesQuery),
    handle: async (url: URL) => QueryHandlers.handleAuthorArticlesQuery(url),
  },

  // Article handlers
  {
    name: "article-id-query",
    priority: 95,
    match: (q: string) => matchStrategies.pattern(q, articleIdQuery),
    handle: async (url: URL) => QueryHandlers.handleArticleIdQuery(url),
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
    handle: async (url: URL) => QueryHandlers.handleArticlesQuery(url),
  },
  {
    name: "article-details-query",
    priority: 95,
    match: (q: string) => matchStrategies.pattern(q, articleDetailsQuery),
    handle: async (url: URL) => QueryHandlers.handleArticleDetailsQuery(url),
  },
  {
    name: "related-query",
    priority: 90,
    match: (q: string) => matchStrategies.pattern(q, relatedQuery),
    handle: async (url: URL) => QueryHandlers.handleRelatedQuery(url),
  },
  {
    name: "tag-query",
    priority: 85,
    match: (q: string) => matchStrategies.pattern(q, tagQuery),
    handle: async (url: URL) => QueryHandlers.handleTagQuery(url),
  },
  {
    name: "category-query",
    priority: 80,
    match: (q: string) => matchStrategies.exact(q, categoryQuery),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle: async (_: URL) => QueryHandlers.handleCategoryQuery(),
  },
  {
    name: "recent-articles-query",
    priority: 75,
    match: (q: string) => matchStrategies.pattern(q, recentArticlesQuery()),
    handle: async (url: URL) => QueryHandlers.handleRecentArticlesQuery(url),
  },
  {
    name: "featured-article",
    priority: 85,
    match: (q: string) => matchStrategies.contains(q, "featured == true"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle: async (_: URL) => QueryHandlers.handleFeaturedArticleQuery(),
  },

  // TODO: Add tutorial handlers
  // TODO: Add program handlers
  // TODO: Add course handlers
  // TODO: Add module handlers
  // TODO: Add sub module handlers
  // TODO: Add lesson handlers
  // TODO: Add challenge handlers
];

// ============================================================================
// MSW HTTP HANDLERS
// ============================================================================

/**
 * Main HTTP handler for Sanity API requests
 * Routes GROQ queries to appropriate handlers and returns responses
 */
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

    console.log("🔍 Sanity handler received query:", query);
    const handler = queryHandlers.find((h) => {
      const matches = h.match(query);
      console.log(`📋 Checking handler ${h.name}: ${matches}`);
      return matches;
    });

    if (handler) {
      console.log("✅ Using handler:", handler.name);
      const result = await handler.handle(url);
      return HttpResponse.json({ result });
    }

    console.log("❌ No handler found for query:", query);
    return HttpResponse.json(
      { error: "No handler found for query" },
      { status: StatusCodes.NOT_FOUND },
    );
  }),
];
