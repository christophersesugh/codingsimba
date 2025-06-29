import { z } from "zod";
import { AuthorSchema } from "../authors/types";
import {
  ArgsSchema,
  CategorySchema,
  ComponentSchema,
  SandpackTemplateSchema,
  TagsSchema,
} from "../articles/types";

/**
 * Schema for a tutorial lesson
 * Defines the structure of a lesson within a tutorial.
 */
const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime({ offset: true }),
  published: z.boolean(),
  content: z.string(),
  sandpackTemplates: z.array(SandpackTemplateSchema),
  reactComponents: z.array(ComponentSchema),
});

/**
 * Schema for a complete tutorial
 * Defines the structure of a tutorial in the system.
 */
export const TutorialSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: CategorySchema,
  author: AuthorSchema,
  tags: TagsSchema,
  published: z.boolean(),
  premium: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  lessons: z.array(LessonSchema),
  lessonsCount: z.number().optional(),
});

/**
 * Schema for a tutorial lesson with tutorial context
 * Defines the structure of a lesson with its parent tutorial information.
 */
export const TutorialLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime({ offset: true }),
  published: z.boolean(),
  content: z.string(),
  tutorial: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    category: CategorySchema,
    author: AuthorSchema,
    tags: TagsSchema,
    published: z.boolean(),
    premium: z.boolean(),
    createdAt: z.string().datetime({ offset: true }),
  }),
  sandpackTemplates: z.array(SandpackTemplateSchema),
  reactComponents: z.array(ComponentSchema),
});

/**
 * Type representing a complete tutorial
 */
export type Tutorial = z.infer<typeof TutorialSchema>;

/**
 * Type representing a tutorial lesson
 */
export type TutorialLesson = z.infer<typeof TutorialLessonSchema>;

/**
 * Type representing a single lesson
 */
export type Lesson = z.infer<typeof LessonSchema>;

/**
 * Type representing a single tag
 */
export type Tag = z.infer<typeof TagsSchema>[number];

/**
 * Type representing a category
 */
export type Category = z.infer<typeof CategorySchema>;

/**
 * Type representing tutorial query arguments
 */
export type TutorialArgs = z.infer<typeof ArgsSchema>;

/**
 * Type representing a Sandpack template
 */
export type SandpackTemplate = z.infer<typeof SandpackTemplateSchema>;

/**
 * Type representing a React component
 */
export type Component = z.infer<typeof ComponentSchema>;
