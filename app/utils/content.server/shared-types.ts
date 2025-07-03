import { z } from "zod";

/**
 * Schema for URL query parameters
 * Defines the structure of query parameters that can be used to filter articles.
 *
 * @property {string} [search] - Search term to filter articles
 * @property {string} [tag] - Tag to filter articles by
 * @property {string} [order] - Sort order for articles
 * @property {string} [category] - Category to filter articles by
 * @property {number} [page] - Page number for pagination (defaults to 1)
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
 * Defines the structure of arguments used to query articles.
 *
 * @property {string} [search] - Search term to filter articles
 * @property {string} [tag] - Tag to filter articles by
 * @property {string} [order] - Sort order for articles
 * @property {string} [category] - Category to filter articles by
 * @property {number} [start] - Start index for pagination (defaults to 0)
 * @property {number} [end] - End index for pagination (defaults to 6)
 */
export const ArgsSchema = UrlSchema.extend({
  start: z.number().min(0).default(0),
  end: z.number().min(1).default(6),
}).omit({ page: true });

/**
 * Schema for a single file in a Sandpack template
 * Defines the structure of code files that can be included in a Sandpack template.
 *
 * @property {string} path - The file path within the template
 * @property {string} code - The actual code content of the file
 * @property {boolean} [active] - Whether this file should be active by default
 * @property {boolean} [hidden] - Whether this file should be hidden from the file explorer
 * @property {boolean} [readOnly] - Whether this file should be read-only in the editor
 */
const SandpackFileSchema = z.object({
  path: z.string(),
  code: z.string(),
  active: z.boolean().optional(),
  hidden: z.boolean().optional(),
  readOnly: z.boolean().optional(),
});

/**
 * Schema for Sandpack editor configuration options
 * Defines the visual and functional settings for the Sandpack editor.
 *
 * @property {string[]} [visibleFiles] - List of file paths that should be visible in the editor
 * @property {string} [activeFile] - The file that should be active when the editor loads
 * @property {boolean} [showLineNumbers] - Whether to display line numbers in the editor
 * @property {boolean} [showInlineErrors] - Whether to show inline error messages
 * @property {boolean} [showTabs] - Whether to show the file tabs bar
 * @property {'split'|'preview'|'editor'} [view] - The initial view mode of the editor
 * @property {string} [editorHeight] - Custom height for the editor component
 * @property {'light'|'dark'|'auto'} [theme] - The color theme for the editor
 * @property {boolean} [autorun] - Whether to automatically run the code on load
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
 * Defines the structure of a single npm package dependency.
 *
 * @property {string} name - The name of the npm package
 * @property {string} version - The version of the package to install
 */
const DependencySchema = z.object({
  name: z.string(),
  version: z.string(),
});

/**
 * Schema for Sandpack custom setup configuration
 * Defines the dependencies and development dependencies for a Sandpack template.
 *
 * @property {DependencySchema[]} [dependencies] - Regular runtime dependencies
 * @property {DependencySchema[]} [devDependencies] - Development dependencies
 */
const SandpackCustomSetupSchema = z.object({
  dependencies: z.array(DependencySchema).optional(),
  devDependencies: z.array(DependencySchema).optional(),
});

/**
 * Schema for a Sandpack template
 * Defines a complete Sandpack template configuration including files, options, and setup.
 *
 * @property {string} id - Unique identifier for the template
 * @property {string} title - Display title of the template
 * @property {string} slug - URL-friendly identifier for the template
 * @property {string} [description] - Optional description of the template
 * @property {'static'|'vanilla'|'vanilla-ts'|'vite-react'|'vite-react-ts'|'node'} template - The base template type
 * @property {SandpackFileSchema[]} sandpackFiles - Array of files included in the template
 * @property {SandpackOptionsSchema} [options] - Optional editor configuration
 * @property {SandpackCustomSetupSchema} [customSetup] - Optional dependency configuration
 */
export const SandpackTemplateSchema = z.object({
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
 * Schema for a Sanity code field
 * Defines the structure of a code block in Sanity.
 *
 * @property {string} _type - The type identifier, must be "code"
 * @property {'tsx'|'jsx'|'typescript'|'javascript'} language - The programming language
 * @property {string} filename - The name of the file
 * @property {string} code - The actual code content
 */
export const SanityCodeFieldSchema = z.object({
  _type: z.literal("code"),
  language: z.enum(["tsx", "jsx", "typescript", "javascript"]),
  filename: z.string(),
  code: z.string(),
});

/**
 * Schema for a React component
 * Defines the structure of a React component in the system.
 *
 * @property {string} id - Unique identifier for the component
 * @property {string} title - Display title of the component
 * @property {SanityCodeFieldSchema} file - The component's code file
 */
export const ComponentSchema = z.object({
  id: z.string(),
  title: z.string(),
  file: SanityCodeFieldSchema,
});

/**
 * Schema for component code
 * Defines the structure of a component's code content.
 *
 * @property {string} filename - The name of the file
 * @property {string} code - The actual code content
 */

export const ComponentCodeSchema = z.object({
  filename: z.string(),
  code: z.string(),
});

/**
 * Schema for article tags
 * Defines the structure of tags that can be associated with articles.
 *
 * @property {string} id - Unique identifier for the tag
 * @property {string} title - Display title of the tag
 * @property {string} slug - URL-friendly identifier for the tag
 */
export const TagsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
  }),
);

/**
 * Schema for article category
 * Defines the structure of a category that an article can belong to.
 *
 * @property {string} id - Unique identifier for the category
 * @property {string} title - Display title of the category
 * @property {string} slug - URL-friendly identifier for the category
 */
export const CategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
});

/**
 * Type representing article query arguments
 */
export type Args = z.infer<typeof ArgsSchema>;

/**
 * Type representing a Sanity code field
 */
export type SandpackCodeField = z.infer<typeof SanityCodeFieldSchema>;

/**
 * Type representing a Component code
 */
export type ComponentCode = z.infer<typeof ComponentCodeSchema>;

/**
 * Type representing a single tag
 */
export type Tag = z.infer<typeof TagsSchema>[number];

/**
 * Type representing a category
 */
export type Category = z.infer<typeof CategorySchema>;
