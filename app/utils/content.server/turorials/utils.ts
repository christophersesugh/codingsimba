import type { Tutorial, TutorialLesson } from "./types";
import type { QueryParams } from "@sanity/client";
import type { TutorialArgs } from "./types";
import { client } from "../loader";
import {
  tutorialsQuery,
  tutorialDetailsQuery,
  tutorialsByCategoryQuery,
  tutorialLessonQuery,
  tutorialLessonsQuery,
} from "./queries";
import { bundleMDX } from "~/utils/mdx.server";
import { bundleComponents, MarkdownConverter } from "~/utils/misc.server";

/**
 * Retrieves a list of tutorials based on specified filtering criteria
 * @param {TutorialArgs} args - The arguments for filtering and pagination
 * @param {string} [args.category=""] - Category slug to filter tutorials
 * @param {string} [args.author=""] - Author slug to filter tutorials
 * @param {string} [args.search=""] - Search term to filter tutorials
 * @param {string} [args.order="createdAt desc"] - Sort order for tutorials
 * @param {number} [args.start] - Start index for pagination
 * @param {number} [args.end] - End index for pagination
 * @returns {Promise<Tutorial[]>} Array of filtered tutorials
 * @example
 * // Get the first 10 tutorials in the "javascript" category
 * const tutorials = await getTutorials({
 *   category: "javascript",
 *   start: 0,
 *   end: 10
 * });
 */
export async function getTutorials(args: TutorialArgs) {
  const { category = "", search = "", start, end } = args;

  const queryParams = {
    ...(category && { categorySlug: category }),
    ...(search && { search: `*${search}*` }),
    start,
    end,
  } as QueryParams;

  let query = tutorialsQuery;
  if (category) query = tutorialsByCategoryQuery;

  const tutorials = await client.fetch<Tutorial[]>(query, queryParams);
  return tutorials ?? [];
}

/**
 * Retrieves detailed information about a specific tutorial by its slug
 * @param {string} slug - The slug of the tutorial to retrieve
 * @returns {Promise<Tutorial | null>} Detailed tutorial information or null if not found
 * @example
 * // Get full details of a tutorial about React hooks
 * const tutorial = await getTutorialDetails("react-hooks-guide");
 * console.log(tutorial.title); // "Complete Guide to React Hooks"
 */
export async function getTutorialDetails(slug: string) {
  const tutorial = await client.fetch<Tutorial | null>(tutorialDetailsQuery, {
    slug,
  });

  if (!tutorial) return null;

  // Process lessons content
  const processedLessons = await Promise.all(
    tutorial.lessons.map(async (lesson) => {
      const refinedComponents = bundleComponents(
        lesson.reactComponents.map((comp) => ({
          file: {
            filename: `${comp.title}.tsx`,
            code: comp.file.code,
          },
        })),
      );
      const { code } = await bundleMDX({
        source: lesson.content,
        files: refinedComponents,
      });

      return {
        ...lesson,
        content: code,
        markdown: lesson.content,
        html: await MarkdownConverter.toHtml(lesson.content),
      };
    }),
  );

  return {
    ...tutorial,
    lessons: processedLessons,
  };
}

/**
 * Retrieves a specific tutorial lesson by its slug
 * @param {string} lessonSlug - The slug of the lesson to retrieve
 * @returns {Promise<TutorialLesson | null>} Detailed lesson information or null if not found
 * @example
 * // Get full details of a lesson
 * const lesson = await getTutorialLesson("introduction-to-hooks");
 * console.log(lesson.title); // "Introduction to React Hooks"
 */
export async function getTutorialLesson(lessonSlug: string) {
  const lesson = await client.fetch<TutorialLesson | null>(
    tutorialLessonQuery,
    { lessonSlug },
  );

  if (!lesson) return null;

  const refinedComponents = bundleComponents(
    lesson.reactComponents.map((comp) => ({
      file: {
        filename: `${comp.title}.tsx`,
        code: comp.file.code,
      },
    })),
  );
  const { code } = await bundleMDX({
    source: lesson.content,
    files: refinedComponents,
  });

  return {
    ...lesson,
    content: code,
    markdown: lesson.content,
    html: await MarkdownConverter.toHtml(lesson.content),
  };
}

/**
 * Retrieves all lessons for a specific tutorial
 * @param {string} tutorialSlug - The slug of the tutorial
 * @returns {Promise<TutorialLesson[]>} Array of lessons for the tutorial
 * @example
 * // Get all lessons for a tutorial
 * const lessons = await getTutorialLessons("react-hooks-guide");
 * lessons.forEach(lesson => console.log(lesson.title));
 */
export async function getTutorialLessons(tutorialSlug: string) {
  const lessons = await client.fetch<TutorialLesson[]>(tutorialLessonsQuery, {
    tutorialSlug,
  });

  const processedLessons = await Promise.all(
    (lessons ?? []).map(async (lesson) => {
      const refinedComponents = bundleComponents(
        lesson.reactComponents.map((comp) => ({
          file: {
            filename: `${comp.title}.tsx`,
            code: comp.file.code,
          },
        })),
      );
      const { code } = await bundleMDX({
        source: lesson.content,
        files: refinedComponents,
      });

      return {
        ...lesson,
        content: code,
        markdown: lesson.content,
        html: await MarkdownConverter.toHtml(lesson.content),
      };
    }),
  );

  return processedLessons;
}

/**
 * Retrieves tutorials by category
 * @param {string} categorySlug - The slug of the category
 * @returns {Promise<Tutorial[]>} Array of tutorials in the category
 * @example
 * // Get all tutorials in the JavaScript category
 * const tutorials = await getTutorialsByCategory("javascript");
 * tutorials.forEach(tutorial => console.log(tutorial.title));
 */
export async function getTutorialsByCategory(categorySlug: string) {
  const tutorials = await client.fetch<Tutorial[]>(tutorialsByCategoryQuery, {
    categorySlug,
  });
  return tutorials ?? [];
}

/**
 * Retrieves a tutorial by its slug
 * @param {string} slug - The slug of the tutorial to retrieve
 * @returns {Promise<Tutorial | null>} Detailed tutorial information or null if not found
 * @example
 * // Get full details of a tutorial about React hooks
 * const tutorial = await getTutorialBySlug("react-hooks");
 * console.log(tutorial.title); // "React Hooks"
 */
export async function getTutorialBySlug(slug: string) {
  const tutorial = await client.fetch<Tutorial | null>(tutorialDetailsQuery, {
    slug,
  });
  return tutorial ?? null;
}
