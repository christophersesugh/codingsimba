import type { Article, RelatedArticles } from "./types";
import type { QueryParams } from "@sanity/client";
import type { Args, Tag } from "../shared-types";
import { client } from "../loader";
import {
  articleDetailsQuery,
  articlesQuery,
  countQuery,
  recentArticlesQuery,
  relatedQuery,
  tagQuery,
  featuredArticleQuery,
  articleIdQuery,
} from "./queries";
import { bundleMDX } from "~/utils/mdx.server";
import { bundleComponents, MarkdownConverter } from "~/utils/misc.server";

/**
 * Retrieves the ID of an article by its slug
 * @param {string} slug - The slug of the article to retrieve
 * @returns {Promise<string | undefined>} The ID of the article or undefined if not found
 * @example
 * // Get the ID of an article about React hooks
 * const id = await getArticleIdBySlug("react-hooks-guide");
 * console.log(id); // "1234567890"
 */
export async function getArticleIdBySlug(slug: string) {
  return client
    .fetch<{ id: string }>(articleIdQuery, { slug })
    .then((article) => article.id)
    .catch(() => undefined);
}

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
export async function getArticles(args: Args) {
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
    (response.articles ?? []).map(async (article) => ({
      ...article,
      markdown: article.content,
      html: await MarkdownConverter.toHtml(article.content),
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
  return client.fetch<number>(countQuery);
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

  /**
   * Tiptap editor needs html
   * MDX previewer needs bundled markdown
   */
  return {
    ...article,
    content: code,
    markdown: article.content,
    html: await MarkdownConverter.toHtml(article.content),
    relatedArticles:
      (await Promise.all(
        (relatedArticles ?? []).map(async (a) => ({
          ...a,
          markdown: a.content,
        })),
      )) || [],
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
export async function getRecentArticles(limit = 2) {
  const articles =
    (await client.fetch<RelatedArticles>(recentArticlesQuery(), { limit })) ??
    [];
  return (
    (await Promise.all(
      articles.map(async (a) => ({
        ...a,
        markdown: a.content,
      })),
    )) || []
  );
}

/**
 * Retrieves the featured article
 * @returns {Promise<Article | null>} The featured article or null if none exists
 * @example
 * // Get the featured article
 * const featured = await getFeaturedArticle();
 * if (featured) {
 *   console.log(featured.title);
 * }
 */
export async function getFeaturedArticle() {
  const article = await client.fetch<Article | null>(featuredArticleQuery);
  if (!article) return null;
  return {
    ...article,
    markdown: article.content,
  };
}
