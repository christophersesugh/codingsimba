import type { Category } from "./shared-types";
import { client } from "./loader";
import { categoryQuery } from "./shared-queries";

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
