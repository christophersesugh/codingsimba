import type { Author } from "./types";
import type { Article } from "../articles/types";
import { client } from "../loader";
import { authorDetailsQuery, authorArticlesQuery } from "./queries";

/**
 * Retrieves detailed information about a specific author by their slug
 * @param {string} slug - The slug of the author to retrieve
 * @returns {Promise<Author | null>} Detailed author information or null if not found
 * @example
 * // Get full details of an author
 * const author = await getAuthorBySlug("christopher-aondona");
 * console.log(author.name); // "Christopher S. Aondona"
 */
export async function getAuthorBySlug(slug: string) {
  const author = await client.fetch<Author | null>(authorDetailsQuery, {
    slug,
  });
  return author;
}

/**
 * Retrieves articles written by a specific author
 * @param {string} slug - The slug of the author
 * @returns {Promise<Article[]>} Array of articles written by the author
 * @example
 * // Get all articles by an author
 * const articles = await getAuthorArticles("christopher-aondona");
 * articles.forEach(article => console.log(article.title));
 */
export async function getAuthorArticles(slug: string) {
  const articles = await client.fetch<Article[]>(authorArticlesQuery, { slug });
  return articles;
}
