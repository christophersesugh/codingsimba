import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { readPageContent } from "~/utils/misc.server";
import type { SanityReactComponent, SanitySandpackTemplate } from "./utils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Tutorial content interface
 */
export interface SanityTutorial {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  authorId: string;
  tags: SanityTag[];
  published: boolean;
  premium: boolean;
  createdAt: string;
  lessons: string[]; // References to tutorial lesson IDs
  overview: string;
}

/**
 * Tutorial lesson content interface
 */
export interface SanityTutorialLesson {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  published: boolean;
  overview: string;
  sandpackTemplates?: string[]; // References to sandpack template IDs
  reactComponents?: string[]; // References to react component IDs
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
 * Fully resolved tutorial with all references populated
 */
export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  authorId: string;
  published: boolean;
  premium: boolean;
  createdAt: string;
  lessons: TutorialLesson[];
  overview: string;
  category: SanityCategory;
  author: SanityAuthor;
  tags: SanityTag[];
}

/**
 * Fully resolved tutorial lesson
 */
export interface TutorialLesson {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  published: boolean;
  overview: string;
  sandpackTemplates?: SanitySandpackTemplate[];
  reactComponents?: SanityReactComponent[];
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * In-memory cache for tutorials and lessons
 */
const tutorialCache = new Map<string, SanityTutorial[]>();
const lessonCache = new Map<string, SanityTutorialLesson[]>();

/**
 * Clears the tutorial cache for development and testing
 */
export function clearTutorialCache(): void {
  tutorialCache.clear();
  lessonCache.clear();
}

// ============================================================================
// CONTENT LOADING UTILITIES
// ============================================================================

/**
 * Loads tutorials from MDX files in the fixtures directory
 */
export async function getTutorialsFromDirectory(): Promise<SanityTutorial[]> {
  const cacheKey = "tutorials";

  if (tutorialCache.has(cacheKey)) {
    return tutorialCache.get(cacheKey)!;
  }

  try {
    const contentDir = path.join(
      process.cwd(),
      "tests/fixtures/sanity",
      "tutorials",
    );
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`Found MDX files for tutorials:`, mdxFiles.length);

    const tutorials = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent({
            basePath: "tests/fixtures/sanity",
            pageName: `tutorials/${slug}`,
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
            overview: markdownContent,
          } as SanityTutorial;
        } catch (error) {
          console.error(`Error processing tutorial ${file}:`, error);
          return null;
        }
      }),
    );

    const validTutorials = tutorials.filter(Boolean) as SanityTutorial[];
    tutorialCache.set(cacheKey, validTutorials);
    console.log(`Processed tutorials:`, validTutorials.length);
    return validTutorials;
  } catch (error) {
    console.error(`Error loading tutorials:`, error);
    return [];
  }
}

/**
 * Loads tutorial lessons from MDX files in the fixtures directory
 */
export async function getTutorialLessonsFromDirectory(): Promise<
  SanityTutorialLesson[]
> {
  const cacheKey = "tutorial-lessons";

  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey)!;
  }

  try {
    const contentDir = path.join(
      process.cwd(),
      "tests/fixtures/sanity",
      "tutorial-lessons",
    );
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`Found MDX files for tutorial lessons:`, mdxFiles.length);

    const lessons = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent({
            basePath: "tests/fixtures/sanity",
            pageName: `tutorial-lessons/${slug}`,
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
            overview: markdownContent,
          } as SanityTutorialLesson;
        } catch (error) {
          console.error(`Error processing tutorial lesson ${file}:`, error);
          return null;
        }
      }),
    );

    const validLessons = lessons.filter(Boolean) as SanityTutorialLesson[];
    lessonCache.set(cacheKey, validLessons);
    console.log(`Processed tutorial lessons:`, validLessons.length);
    return validLessons;
  } catch (error) {
    console.error(`Error loading tutorial lessons:`, error);
    return [];
  }
}

// ============================================================================
// REFERENCE RESOLUTION
// ============================================================================

/**
 * Loads all tags from the fixtures
 */
export async function getTagsFromDirectory(): Promise<SanityTag[]> {
  try {
    const contentDir = path.join(
      process.cwd(),
      "tests/fixtures/sanity",
      "tags",
    );
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const tags = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent({
            basePath: "tests/fixtures/sanity",
            pageName: `tags/${slug}`,
          });

          if (!content) return null;

          const { data: frontmatter } = matter(content);
          return {
            ...frontmatter,
            slug,
          } as SanityTag;
        } catch (error) {
          console.error(`Error processing tag ${file}:`, error);
          return null;
        }
      }),
    );

    return tags.filter(Boolean) as SanityTag[];
  } catch (error) {
    console.error(`Error loading tags:`, error);
    return [];
  }
}

/**
 * Loads all categories from the fixtures
 */
export async function getCategoriesFromDirectory(): Promise<SanityCategory[]> {
  try {
    const contentDir = path.join(
      process.cwd(),
      "tests/fixtures/sanity",
      "categories",
    );
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const categories = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent({
            basePath: "tests/fixtures/sanity",
            pageName: `categories/${slug}`,
          });

          if (!content) return null;

          const { data: frontmatter } = matter(content);
          return {
            ...frontmatter,
            slug,
          } as SanityCategory;
        } catch (error) {
          console.error(`Error processing category ${file}:`, error);
          return null;
        }
      }),
    );

    return categories.filter(Boolean) as SanityCategory[];
  } catch (error) {
    console.error(`Error loading categories:`, error);
    return [];
  }
}

/**
 * Loads all authors from the fixtures
 */
export async function getAuthorsFromDirectory(): Promise<SanityAuthor[]> {
  try {
    const contentDir = path.join(
      process.cwd(),
      "tests/fixtures/sanity",
      "authors",
    );
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const authors = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const content = await readPageContent({
            basePath: "tests/fixtures/sanity",
            pageName: `authors/${slug}`,
          });

          if (!content) return null;

          const { data: frontmatter } = matter(content);
          return {
            ...frontmatter,
            slug,
          } as SanityAuthor;
        } catch (error) {
          console.error(`Error processing author ${file}:`, error);
          return null;
        }
      }),
    );

    return authors.filter(Boolean) as SanityAuthor[];
  } catch (error) {
    console.error(`Error loading authors:`, error);
    return [];
  }
}

/**
 * Resolves references for a single tutorial
 * Converts SanityTutorial to Tutorial with populated author, category, tags, and lessons
 */
export async function resolveTutorialReferences(
  tutorial: SanityTutorial,
): Promise<Tutorial> {
  const [authors, categories, tags, lessons] = await Promise.all([
    getAuthorsFromDirectory(),
    getCategoriesFromDirectory(),
    getTagsFromDirectory(),
    getTutorialLessonsFromDirectory(),
  ]);

  const author = authors.find((a) => a.id === tutorial.authorId);
  const category = categories.find((c) => c.id === tutorial.categoryId);
  const resolvedTags = (tutorial.tags || [])
    .map((t: SanityTag) => tags.find((tag) => tag.id === t.id))
    .filter((tag): tag is SanityTag => tag !== undefined);

  // Resolve lessons
  const resolvedLessons = (tutorial.lessons || [])
    .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
    .filter((lesson): lesson is SanityTutorialLesson => lesson !== undefined)
    .map((lesson) => ({
      ...lesson,
      sandpackTemplates: [], // TODO: Resolve sandpack templates
      reactComponents: [], // TODO: Resolve react components
    }));

  if (!author || !category) {
    throw new Error(`Missing author or category for tutorial ${tutorial.id}`);
  }

  return {
    ...tutorial,
    author,
    category,
    tags: resolvedTags,
    lessons: resolvedLessons,
  };
}

/**
 * Resolves references for multiple tutorials
 */
export async function resolveTutorialsReferences(
  tutorials: SanityTutorial[],
): Promise<Tutorial[]> {
  return Promise.all(tutorials.map(resolveTutorialReferences));
}

// ============================================================================
// QUERY MATCHING UTILITIES
// ============================================================================

/**
 * Normalizes GROQ queries for consistent matching
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
};

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
// TUTORIAL QUERY RESOLVERS
// ============================================================================

/**
 * Handles resolution of references for tutorial content items
 */
export class TutorialQueryResolver {
  /**
   * Loads all tutorials from the fixtures
   */
  static async getTutorials() {
    return await getTutorialsFromDirectory();
  }

  /**
   * Loads all tutorial lessons from the fixtures
   */
  static async getTutorialLessons() {
    return await getTutorialLessonsFromDirectory();
  }

  /**
   * Handles queries for tutorial details by slug
   */
  static async handleTutorialDetailsQuery(url: URL) {
    const slug = url.searchParams.get("$slug");
    const tutorials = await TutorialQueryResolver.getTutorials();
    const tutorial = tutorials.find(
      (t) => t.slug === slug?.replace(/["']/g, ""),
    );

    if (!tutorial) {
      throw new Error("Tutorial not found");
    }
    return resolveTutorialReferences(tutorial);
  }

  /**
   * Handles queries for all tutorials with filtering
   */
  static async handleTutorialsQuery(url: URL) {
    const search =
      url.searchParams.get("$search")?.replace(/\*/g, "") || undefined;
    const category = url.searchParams.get("$category") || undefined;
    const tag = url.searchParams.get("$tag") || undefined;
    const order = url.searchParams.get("$order") || "createdAt desc";
    const start = Math.max(0, Number(url.searchParams.get("$start") ?? 0));
    const end = Number(url.searchParams.get("$end") ?? start + 6);
    const pageSize = end - start;
    const tutorials = await TutorialQueryResolver.getTutorials();

    const resolvedTutorials = await resolveTutorialsReferences(tutorials);

    let filteredTutorials = resolvedTutorials.filter((t) => t.published);

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTutorials = filteredTutorials.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm) ||
          t.overview.toLowerCase().includes(searchTerm),
      );
    }

    if (category) {
      filteredTutorials = filteredTutorials.filter(
        (t) => t.category.slug === category,
      );
    }

    if (tag) {
      filteredTutorials = filteredTutorials.filter((t) =>
        t.tags.some((tagItem) => tagItem.slug === tag),
      );
    }

    if (/createdAt\s+desc/i.test(order)) {
      filteredTutorials.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else if (/createdAt\s+asc/i.test(order)) {
      filteredTutorials.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
    }

    const paginatedTutorials = filteredTutorials.slice(start, start + pageSize);
    const tutorialsWithLessonsCount = paginatedTutorials.map((tutorial) => ({
      ...tutorial,
      lessonsCount: tutorial.lessons.length,
    }));

    return {
      tutorials: tutorialsWithLessonsCount,
      total: filteredTutorials.length,
    };
  }

  /**
   * Handles queries for tutorial lessons by tutorial slug
   */
  static async handleTutorialLessonsQuery(url: URL) {
    const tutorialSlug = url.searchParams.get("$tutorialSlug");
    if (!tutorialSlug) {
      throw new Error("Tutorial slug parameter is required");
    }

    const tutorials = await TutorialQueryResolver.getTutorials();
    const tutorial = tutorials.find(
      (t) => t.slug === tutorialSlug.replace(/["']/g, ""),
    );
    if (!tutorial) {
      throw new Error("Tutorial not found");
    }

    const lessons = await TutorialQueryResolver.getTutorialLessons();
    const tutorialLessons = lessons.filter((lesson) =>
      tutorial.lessons.includes(lesson.id),
    );

    return tutorialLessons.map((lesson) => ({
      ...lesson,
      sandpackTemplates: [], // TODO: Resolve sandpack templates
      reactComponents: [], // TODO: Resolve react components
    }));
  }
}

// ============================================================================
// TUTORIAL QUERY HANDLER REGISTRY
// ============================================================================

/**
 * Registry of all tutorial query handlers
 * Handlers are matched in order of priority (highest first)
 */
export const tutorialQueryHandler: QueryHandler[] = [
  {
    name: "tutorial-details-query",
    priority: 95,
    match: (q: string) =>
      q.includes('_type == "tutorial"') &&
      q.includes("slug.current == $slug") &&
      q.includes("published == true"),
    handle: async (url: URL) =>
      TutorialQueryResolver.handleTutorialDetailsQuery(url),
  },
  {
    name: "tutorials-query",
    priority: 50,
    match: (q: string) =>
      q.includes('_type == "tutorial"') &&
      q.includes("published == true") &&
      q.includes('"total": count(*'),
    handle: async (url: URL) => TutorialQueryResolver.handleTutorialsQuery(url),
  },
  {
    name: "tutorial-lessons-query",
    priority: 90,
    match: (q: string) =>
      q.includes('_type == "tutorialLesson"') &&
      q.includes("published == true"),
    handle: async (url: URL) =>
      TutorialQueryResolver.handleTutorialLessonsQuery(url),
  },
  {
    name: "categories-query",
    priority: 80,
    match: (q: string) =>
      q.includes('_type == "category"') &&
      q.includes('"id": _id') &&
      q.includes('"slug": slug.current'),
    handle: async () => getCategoriesFromDirectory(),
  },
];
