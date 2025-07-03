/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { readPageContent } from "~/utils/misc.server";

// ============================================================================
// SHARED TYPE DEFINITIONS
// ============================================================================

/**
 * Tag system for content organization
 */
export interface SanityTag {
  id: string;
  title: string;
  slug: string;
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

// ============================================================================
// QUERY HANDLER INTERFACE
// ============================================================================

/**
 * Interface for query handlers that process GROQ queries
 */
export interface QueryHandler {
  name: string;
  match: (query: string) => boolean;

  handle: (url: URL) => Promise<any> | any;
  priority?: number;
}

// ============================================================================
// QUERY MATCHING UTILITIES
// ============================================================================

/**
 * Normalizes GROQ queries for consistent matching
 */
export function normalizeQuery(query: string): string {
  if (!query) return "";
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
};

// ============================================================================
// CONTENT LOADING UTILITIES
// ============================================================================

/**
 * Generic function to load content from MDX files in the fixtures directory
 */
export async function getContentFromDirectory<T>(
  contentType: string,
): Promise<T[]> {
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
          } as T;
        } catch (error) {
          console.error(`Error processing ${contentType} ${file}:`, error);
          return null;
        }
      }),
    );

    const validContent = content.filter(Boolean) as T[];
    console.log(`Processed ${contentType}:`, validContent.length);
    return validContent;
  } catch (error) {
    console.error(`Error loading ${contentType}:`, error);
    return [];
  }
}

/**
 * Loads all tags from the fixtures
 */
export async function getTagsFromDirectory(): Promise<SanityTag[]> {
  return getContentFromDirectory<SanityTag>("tags");
}

/**
 * Loads all categories from the fixtures
 */
export async function getCategoriesFromDirectory(): Promise<SanityCategory[]> {
  return getContentFromDirectory<SanityCategory>("categories");
}

/**
 * Loads all authors from the fixtures
 */
export async function getAuthorsFromDirectory(): Promise<SanityAuthor[]> {
  return getContentFromDirectory<SanityAuthor>("authors");
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Generic cache for content to avoid repeated file system reads
 */
export class ContentCache<T> {
  private cache = new Map<string, T[]>();

  /**
   * Gets content from cache or loads it from directory
   */
  async getOrLoad(cacheKey: string, loader: () => Promise<T[]>): Promise<T[]> {
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const content = await loader();
    this.cache.set(cacheKey, content);
    return content;
  }

  /**
   * Clears the cache for a specific key or all content
   */
  clear(cacheKey?: string): void {
    if (cacheKey) {
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Checks if cache has a specific key
   */
  has(cacheKey: string): boolean {
    return this.cache.has(cacheKey);
  }

  /**
   * Sets content for a specific cache key
   */
  set(cacheKey: string, content: T[]): void {
    this.cache.set(cacheKey, content);
  }
}

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
 * Generic function to filter and paginate content
 */
export function filterContent<
  T extends { published?: boolean; featured?: boolean },
>(
  content: T[],
  options: FilterOptions,
  searchFields: (item: T) => string[],
  categoryField?: (item: T) => string,
  tagField?: (item: T) => string[],
): { content: T[]; total: number } {
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
    filteredContent = filteredContent.filter((item) => {
      const searchableFields = searchFields(item);
      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm),
      );
    });
  }

  // Apply category filter
  if (options.category && categoryField) {
    filteredContent = filteredContent.filter(
      (item) => categoryField(item) === options.category,
    );
  }

  // Apply tag filter
  if (options.tag && tagField) {
    filteredContent = filteredContent.filter((item) =>
      tagField(item).some((t) => t === options.tag),
    );
  }

  // Apply sorting
  if (options.order) {
    if (/createdAt\s+desc/i.test(options.order)) {
      filteredContent.sort((a, b) => {
        const dateA = new Date((a as any).createdAt).getTime();
        const dateB = new Date((b as any).createdAt).getTime();
        return dateB - dateA;
      });
    } else if (/createdAt\s+asc/i.test(options.order)) {
      filteredContent.sort((a, b) => {
        const dateA = new Date((a as any).createdAt).getTime();
        const dateB = new Date((b as any).createdAt).getTime();
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

// ============================================================================
// URL PARAMETER UTILITIES
// ============================================================================

/**
 * Extracts common query parameters from URL
 */
export function extractQueryParams(url: URL) {
  return {
    search: url.searchParams.get("$search")?.replace(/\*/g, "") || undefined,
    category: url.searchParams.get("$category") || undefined,
    tag: url.searchParams.get("$tag") || undefined,
    order: url.searchParams.get("$order") || "createdAt desc",
    start: Math.max(0, Number(url.searchParams.get("$start") ?? 0)),
    end: Number(url.searchParams.get("$end") ?? 0),
    limit: Number(url.searchParams.get("$limit") ?? 10),
    slug: url.searchParams.get("$slug")?.replace(/["']/g, ""),
  };
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Creates a standardized error for content not found
 */
export function createNotFoundError(
  contentType: string,
  identifier: string,
): Error {
  return new Error(`${contentType} not found: ${identifier}`);
}

/**
 * Creates a standardized error for missing required parameters
 */
export function createMissingParameterError(parameterName: string): Error {
  return new Error(`${parameterName} parameter is required`);
}
