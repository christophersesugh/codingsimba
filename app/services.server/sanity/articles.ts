import type { QueryParams } from "@sanity/client";
import { z } from "zod";
import groq from "groq";
import { loadQuery } from "./loader";
import { bundleMDX } from "~/utils/mdx.server";

const TagsSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string().min(1),
      slug: z.string(),
    }),
  )
  .min(1, "At least one tag is required");

const CategorySchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string(),
});

const RelatedArticlesSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      createdAt: z.string(),
      image: z.string().url(),
      excerpt: z.string(),
    }),
  )
  .default([]);

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  createdAt: z.string().datetime({ offset: true }),
  category: CategorySchema,
  featured: z.boolean().default(false),
  tags: TagsSchema,
  image: z.string().url("Invalid image URL"),
  excerpt: z.string().min(50, "Excerpt too short").max(200, "Excerpt too long"),
  content: z.string().min(100, "Content too short"),
  raw: z.string(),
  videoId: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube ID")
    .optional(),
  relatedArticles: RelatedArticlesSchema,
});

export const UrlSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  order: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ArgsSchema = UrlSchema.extend({
  start: z.number().min(0).default(0),
  end: z.number().min(6).max(6).default(6),
}).omit({ page: true });

export type Article = z.infer<typeof ArticleSchema>;
export type Tag = z.infer<typeof TagsSchema>[number];
export type Category = z.infer<typeof CategorySchema>;
type ArticlesArgs = z.infer<typeof ArgsSchema>;

function articlesQuery({
  search,
  filters,
  order,
}: {
  search: string;
  filters: string;
  order: string;
}) {
  const searchCondition = search
    ? `&& (title match $search || excerpt match $search || content match $search)`
    : "";
  return groq`{
    "articles": *[${filters} ${searchCondition}] | order(${order}) [$start...$end] {
      "id": _id,
      title,
      "slug": slug.current,
      createdAt,
      "category": category->{
        "id": _id,
        title,
        "slug": slug.current
      },
      "tags": tags[]->{
        "id": _id,
        title,
        "slug": slug.current
      },
      published,
      featured,
      "image": image.asset->url,
      excerpt,
      content
    },
    "total": count(*[${filters}])
  }`;
}

/**
 * Fetches articles based on the provided queries.
 * @param {ArticlesArgs} args - The arguments for fetching articles.
 * @returns {Promise<{ articles: Article[]; total: number; }>} - The articles data and total count.
 * @example
 * ```ts
 * const articlesData = await getArticles({
 *   search: "web development",
 *   category: "javascript",
 *   tag: "react",
 *   order: "createdAt desc",
 *   start: 0,
 *   end: 6,
 * });
 * ```
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

  const { data } = await loadQuery<{
    articles: Article[];
    total: number;
  }>(articlesQuery({ search, filters, order }), queryParams);

  const transformedData = await Promise.all(
    (data.articles ?? []).map(async (article) => ({
      ...article,
      raw: article.content,
    })),
  );

  return {
    articles: transformedData,
    total: data.total,
  };
}

const articleDetailsQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  "id": _id,
  title,
    "slug": slug.current,
    createdAt,
    "category": category->{
      "id": _id,
      title,
      "slug": slug.current
    },
    "tags": tags[]->{
      "id": _id,
      title,
      "slug": slug.current
    },
    published,
    "image": image.asset->url,
    excerpt,
    content
  }`;

const relatedQuery = groq`*[
    _type == "article" &&
    published == true &&
    slug.current != $slug &&
    (
      count(tags[@._ref in $tagIds]) > 0 ||
      category._ref == $categoryId
    )
  ] | order(createdAt desc) [0...3] {
    "id": _id,
    title,
    "slug": slug.current,
    createdAt,
    "image": image.asset->url,
    excerpt
  }`;

/**
 * Fetches article details by slug and returns the article data along with related articles.
 * @param {String} slug - The slug of the article to fetch.
 * @returns {Promise<Article>} - The article details including related articles.
 * @example
 * ```ts
 * const articleDetails = await getArticleDetails("my-article-slug");
 * ```
 */
export async function getArticleDetails(slug: string) {
  const article = await loadQuery<Article>(articleDetailsQuery, { slug });

  const relatedArticles = await loadQuery<Article[]>(relatedQuery, {
    slug,
    tagIds: article.data.tags.map((tag) => tag?.id),
    categoryId: article.data.category?.id,
  });

  return {
    ...article.data,
    raw: article.data.content,
    content: (await bundleMDX({ source: article.data.content })).code,
    relatedArticles: relatedArticles.data || [],
  };
}
/**
 * Fetch popular tags from the database.
 * @param {number} limit - The number of tags to fetch.
 * @returns {Promise<Tag[]>} - The popular tags.
 * @example
 * ```ts
 * const popularTags = await getPopularTags();
 * ```
 */
export async function getPopularTags(limit = 10) {
  const query = groq`*[_type == "tag"] {
    "id": _id,
    title,
    "slug": slug.current,
    "count": count(*[_type == "article" && references(^._id)])
  } | order(count desc) [0...$limit]`;
  return loadQuery<Tag[]>(query, { limit });
}

/**
 * Fetch recent articles from the database.
 * @param {number} limit - The number of recent articles to fetch.
 * @returns {Promise<Article[]>} - The recent articles.
 * @example
 * ```ts
 * const recentArticles = await getRecentArticles();
 * ```
 */
export async function getRecentArticles(limit = 4) {
  const query = groq`*[_type == "article" && published == true] | order(createdAt desc) [0...$limit] {
    "id": _id,
    title,
    "slug": slug.current,
    createdAt,
    "category": category->{
      "id": _id,
      title,
      "slug": slug.current
    },
    "image": image.asset->url,
    excerpt
  }`;

  return loadQuery<Article[]>(query, { limit });
}

/**
 * Fetch all categories from sanity.
 * @returns {Promise<Category[]>} - The categories.
 * @example
 * ```ts
 * const categories = await getAllCategories();
 * ```
 */
export async function getAllCategories() {
  const query = groq`*[_type == "category"] {
    "id": _id,
    title,
    "slug": slug.current
  }`;

  return loadQuery<Category[]>(query);
}
