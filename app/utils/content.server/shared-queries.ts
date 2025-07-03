import groq from "groq";

/**
 * GROQ query to fetch all categories
 * @returns {string} GROQ query string that returns:
 * - Category information (id, title, slug)
 * - All categories in the system
 */
export const categoryQuery = groq`*[_type == "category"] {
  "id": _id,
  title,
  "slug": slug.current
}`;
