import type { Article, Category, RelatedArticles, Tag } from "./types";
import type { QueryParams } from "@sanity/client";
import type { ArticlesArgs } from "./types";
import { client } from "../loader";
import {
  articleDetailsQuery,
  articlesQuery,
  categoryQuery,
  countQuery,
  recentArticlesQuery,
  relatedQuery,
  tagQuery,
} from "./queries";
import { bundleMDX } from "~/utils/mdx.server";
import { bundleComponents } from "~/utils/misc.server";

/**
 * Retrieves a list of articles based on specified filtering criteria
 * @param {ArticlesArgs} args - The arguments for filtering and pagination
 * @param {string} [args.search=""] - Search term to filter articles
 * @param {string} [args.category=""] - Category slug to filter articles
 * @param {string} [args.tag=""] - Tag slug to filter articles
 * @param {string} [args.order="createdAt desc"] - Sort order for articles
 * @param {number} [args.start] - Start index for pagination
 * @param {number} [args.end] - End index for pagination
 * @returns {Promise<{articles: Article[], total: number}>} Object containing filtered articles and total count
 * @example
 * // Get the first 10 articles in the "javascript" category
 * const { articles, total } = await getArticles({
 *   category: "javascript",
 *   start: 0,
 *   end: 10
 * });
 */
export async function getArticles(args: ArticlesArgs) {
  const {
    search = "",
    category = "",
    tag = "",
    order = "createdAt desc",
    start,
    end,
  } = args;

  const queryParams = {
    ...(search && { search: `*${search}*` }),
    ...(category && { category }),
    ...(tag && { tag }),
    start,
    end,
  } as QueryParams;

  let filters = `_type == "article" && published == true`;
  if (category) filters += ` && category->slug.current == $category`;
  if (tag) filters += ` && $tag in tags[]->slug.current`;

  const response = await client.fetch<{
    articles: Article[];
    total: number;
  }>(articlesQuery({ search, filters, order }), queryParams);

  const transformedData = await Promise.all(
    (response.articles ?? []).map((article) => ({
      ...article,
      raw: article.content,
    })),
  );

  return {
    articles: transformedData,
    total: response.total ?? 0,
  };
}

/**
 * Counts the total number of published articles
 * @returns {Promise<{count: number}>} Object containing the total count of articles
 * @example
 * // Get the total number of published articles
 * const { count } = await countArticles();
 * console.log(`Total articles: ${count}`);
 */
export async function countArticles() {
  return client.fetch<{ count: number }>(countQuery);
}

/**
 * Retrieves detailed information about a specific article by its slug
 * @param {string} slug - The slug of the article to retrieve
 * @returns {Promise<Article & {content: string, relatedArticles: Article[], sandpackTemplates: any[]}>}
 * Detailed article information including processed content, related articles, and sandpack templates
 * @example
 * // Get full details of an article about React hooks
 * const article = await getArticleDetails("react-hooks-guide");
 * console.log(article.title); // "Complete Guide to React Hooks"
 */
export async function getArticleDetails(slug: string) {
  const article = await client.fetch<Article>(articleDetailsQuery, { slug });
  const relatedArticles = await client.fetch<RelatedArticles>(relatedQuery, {
    slug,
    tagIds: article.tags?.map((tag) => tag.id),
    categoryId: article.category?.id,
  });

  const refinedComponents = bundleComponents(article.reactComponents);

  const { code } = await bundleMDX({
    source: article.content,
    files: refinedComponents,
  });

  return {
    ...article,
    content: code,
    raw: article.content,
    relatedArticles: relatedArticles || [],
    sandpackTemplates: article.sandpackTemplates || [],
  };
}

/**
 * Retrieves the most popular tags used in articles
 * @param {number} [limit=10] - Maximum number of tags to return
 * @returns {Promise<Tag[]>} Array of popular tags
 * @example
 * // Get the top 5 most popular tags
 * const popularTags = await getPopularTags(5);
 * popularTags.forEach(tag => console.log(tag.title));
 */
export async function getPopularTags(limit = 10) {
  return client.fetch<Tag[]>(tagQuery, { limit });
}

/**
 * Retrieves the most recent articles
 * @param {number} [limit=4] - Maximum number of recent articles to return
 * @returns {Promise<Article[]>} Array of recent articles
 * @example
 * // Get the 3 most recent articles
 * const recentArticles = await getRecentArticles(3);
 * recentArticles.forEach(article => console.log(article.title));
 */
export async function getRecentArticles(limit = 4) {
  return client.fetch<Article[]>(recentArticlesQuery(), { limit }) ?? [];
}

/**
 * Retrieves all available categories
 * @returns {Promise<Category[]>} Array of all categories
 * @example
 * // Get all categories and display their titles
 * const categories = await getAllCategories();
 * categories.forEach(category => console.log(category.title));
 */
export async function getAllCategories() {
  return client.fetch<Category[]>(categoryQuery);
}
