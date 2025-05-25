import { z } from "zod";

/**
 * Schema for a single file in a Sandpack template
 * @property {string} path - The file path
 * @property {string} code - The file content
 * @property {boolean} [active] - Whether this file is active
 * @property {boolean} [hidden] - Whether this file is hidden
 * @property {boolean} [readOnly] - Whether this file is read-only
 */
const SandpackFileSchema = z.object({
  path: z.string(),
  code: z.string(),
  active: z.boolean().optional(),
  hidden: z.boolean().optional(),
  readOnly: z.boolean().optional(),
});

/**
 * Schema for Sandpack editor options
 * @property {string[]} [visibleFiles] - List of file paths that should be visible
 * @property {string} [activeFile] - The currently active file
 * @property {boolean} [showLineNumbers] - Whether to show line numbers
 * @property {boolean} [showInlineErrors] - Whether to show inline errors
 * @property {boolean} [showTabs] - Whether to show file tabs
 * @property {'split'|'editor'|'preview'} [view] - Editor view
 * @property {boolean} [editorOnly] - Whether to show only the editor
 * @property {string} [editorHeight] - Height of the editor
 * @property {'light'|'dark'|'auto'} [theme] - Editor theme
 * @property {boolean} [autorun] - Whether to auto-run the code
 */
const SandpackOptionsSchema = z.object({
  visibleFiles: z.array(z.string()).optional(),
  activeFile: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
  showInlineErrors: z.boolean().optional(),
  showTabs: z.boolean().optional(),
  view: z.enum(["split", "preview", "editor"]).default("split"),
  editorHeight: z.string().optional(),
  theme: z.enum(["light", "dark", "auto"]).default("auto"),
  autorun: z.boolean().optional(),
});

/**
 * Schema for a package dependency
 * @property {string} name - Package name
 * @property {string} version - Package version
 */
const DependencySchema = z.object({
  name: z.string(),
  version: z.string(),
});

/**
 * Schema for Sandpack custom setup configuration
 * @property {DependencySchema[]} [dependencies] - Regular dependencies
 * @property {DependencySchema[]} [devDependencies] - Development dependencies
 */
const SandpackCustomSetupSchema = z.object({
  dependencies: z.array(DependencySchema).optional(),
  devDependencies: z.array(DependencySchema).optional(),
});

/**
 * Schema for a Sandpack template
 * @property {string} id - Unique identifier
 * @property {string} title - Template title
 * @property {string} slug - URL-friendly identifier
 * @property {string} [description] - Template description
 * @property {'static'|'vanilla'|'vanilla-ts'|'vite-react'|'vite-react-ts'|'node'} template - Template type
 * @property {SandpackFileSchema[]} sandpackFiles - Files included in the template
 * @property {SandpackOptionsSchema} [options] - Editor options
 * @property {SandpackCustomSetupSchema} [customSetup] - Custom setup configuration
 */
const SandpackTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  template: z.enum([
    "static",
    "vanilla",
    "vanilla-ts",
    "vite-react",
    "vite-react-ts",
    "node",
  ]),
  sandpackFiles: z.array(SandpackFileSchema),
  options: SandpackOptionsSchema.optional(),
  customSetup: SandpackCustomSetupSchema.optional(),
});

/**
 * Schema for article tags
 * @property {string} id - Unique identifier
 * @property {string} title - Tag title
 * @property {string} slug - URL-friendly identifier
 */
const TagsSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string().min(1),
      slug: z.string(),
    }),
  )
  .min(1, "At least one tag is required");

/**
 * Schema for article category
 * @property {string} id - Unique identifier
 * @property {string} title - Category title
 * @property {string} slug - URL-friendly identifier
 */
const CategorySchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string(),
});

/**
 * Schema for related articles
 * @property {string} id - Unique identifier
 * @property {string} title - Article title
 * @property {string} slug - URL-friendly identifier
 * @property {string} createdAt - Creation timestamp
 * @property {string} image - Article image URL
 * @property {string} excerpt - Article excerpt
 */
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

/**
 * Schema for a complete article
 * @property {string} id - Unique identifier
 * @property {string} title - Article title
 * @property {string} slug - URL-friendly identifier
 * @property {string} createdAt - Creation timestamp
 * @property {CategorySchema} category - Article category
 * @property {boolean} featured - Whether the article is featured
 * @property {TagsSchema} tags - Article tags
 * @property {string} image - Article image URL
 * @property {string} excerpt - Article excerpt
 * @property {string} content - Article content
 * @property {string} raw - Raw article content
 * @property {RelatedArticlesSchema} relatedArticles - Related articles
 * @property {SandpackTemplateSchema[]} sandpackTemplates - Associated Sandpack templates
 */
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
  relatedArticles: RelatedArticlesSchema,
  sandpackTemplates: z.array(SandpackTemplateSchema),
});

/**
 * Schema for URL query parameters
 * @property {string} [search] - Search term
 * @property {string} [tag] - Tag filter
 * @property {string} [order] - Sort order
 * @property {string} [category] - Category filter
 * @property {number} [page] - Page number (defaults to 1)
 */
export const UrlSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  order: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
});

/**
 * Schema for article query arguments
 * @property {string} [search] - Search term
 * @property {string} [tag] - Tag filter
 * @property {string} [order] - Sort order
 * @property {string} [category] - Category filter
 * @property {number} [start] - Start index (defaults to 0)
 * @property {number} [end] - End index (defaults to 6)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ArgsSchema = UrlSchema.extend({
  start: z.number().min(0).default(0),
  end: z.number().min(1).default(6),
}).omit({ page: true });

/**
 * Type representing a complete article
 */
export type Article = z.infer<typeof ArticleSchema>;

/**
 * Type representing a single tag
 */
export type Tag = z.infer<typeof TagsSchema>[number];

/**
 * Type representing a category
 */
export type Category = z.infer<typeof CategorySchema>;

/**
 * Type representing article query arguments
 */
export type ArticlesArgs = z.infer<typeof ArgsSchema>;

/**
 * Type representing a Sandpack template
 */
export type SandpackTemplate = z.infer<typeof SandpackTemplateSchema>;
