import groq from "groq";

/**
 * GROQ query to fetch all published tutorials with basic information
 * @returns {string} GROQ query string that returns:
 * - Basic tutorial information (id, title, slug, etc.)
 * - Category and author references
 * - Tags
 * - Published status and premium flag
 * - Creation date
 */
export const tutorialsQuery = groq`*[_type == "tutorial" && published == true] | order(createdAt desc) {
  "id": _id,
  title,
  "slug": slug.current,
  "category": category->{
    "id": _id,
    title,
    "slug": slug.current
  },
  "author": author->{
    "id": _id,
    name,
    "slug": slug.current,
    image,
    bio
  },
  "tags": tags[]->{
    "id": _id,
    title,
    "slug": slug.current
  },
  published,
  premium,
  createdAt,
  "lessonsCount": count(lessons[]->)
}`;

/**
 * GROQ query to fetch detailed information about a specific tutorial
 * @returns {string} GROQ query string that returns:
 * - Complete tutorial information
 * - Resolved category, author, and tags
 * - All lessons with their content
 */
export const tutorialDetailsQuery = groq`*[_type == "tutorial" && slug.current == $slug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  "category": category->{
    "id": _id,
    title,
    "slug": slug.current
  },
  "author": author->{
    "id": _id,
    name,
    "slug": slug.current,
    image,
    bio,
    skills,
    socialLinks
  },
  "tags": tags[]->{
    "id": _id,
    title,
    "slug": slug.current
  },
  published,
  premium,
  createdAt,
  "lessons": lessons[]->{
    "id": _id,
    title,
    "slug": slug.current,
    createdAt,
    published,
    content,
   "sandpackTemplates": sandpackTemplates[]->{
      "id": _id,
      title,
      "slug": slug.current,
      description,
      template,
      sandpackFiles,
      options,
      customSetup
    },
    "reactComponents": reactComponents[]->{
      "id": _id,
      title,
      file
    }
  } | order(createdAt asc)
}`;

/**
 * GROQ query to fetch tutorials by category
 * @returns {string} GROQ query string that returns tutorials filtered by category
 */
export const tutorialsByCategoryQuery = groq`*[_type == "tutorial" && published == true && category->slug.current == $categorySlug] | order(createdAt desc) {
  "id": _id,
  title,
  "slug": slug.current,
  "category": category->{
    "id": _id,
    title,
    "slug": slug.current
  },
  "author": author->{
    "id": _id,
    name,
    "slug": slug.current,
    image,
    bio
  },
  "tags": tags[]->{
    "id": _id,
    title,
    "slug": slug.current
  },
  published,
  premium,
  createdAt,
  "lessonsCount": count(lessons[]->)
}`;

/**
 * GROQ query to fetch a specific tutorial lesson
 * @returns {string} GROQ query string that returns:
 * - Complete lesson information
 * - Resolved tutorial reference
 * - Sandpack templates and React components
 */
export const tutorialLessonQuery = groq`*[_type == "tutorialLesson" && slug.current == $lessonSlug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  createdAt,
  published,
  content,
  "tutorial": tutorial->{
    "id": _id,
    title,
    "slug": slug.current,
    "category": category->{
      "id": _id,
      title,
      "slug": slug.current
    },
    "author": author->{
      "id": _id,
      name,
      "slug": slug.current,
      image,
      bio
    },
    "tags": tags[]->{
      "id": _id,
      title,
      "slug": slug.current
    },
    published,
    premium,
    createdAt
  },
  "sandpackTemplates": sandpackTemplates[]->{
    "id": _id,
    title,
    "slug": slug.current,
    description,
    template,
    sandpackFiles,
    options,
    customSetup
  },
  "reactComponents": reactComponents[]->{
    "id": _id,
    title,
    file
  }
}`;

/**
 * GROQ query to fetch lessons for a specific tutorial
 * @returns {string} GROQ query string that returns all lessons for a tutorial
 */
export const tutorialLessonsQuery = groq`*[_type == "tutorialLesson" && tutorial->slug.current == $tutorialSlug && published == true] | order(createdAt asc) {
  "id": _id,
  title,
  "slug": slug.current,
  createdAt,
  published,
  content,
  "sandpackTemplates": sandpackTemplates[]->{
    "id": _id,
    title,
    "slug": slug.current,
    description,
    template,
    sandpackFiles,
    options,
    customSetup
  },
  "reactComponents": reactComponents[]->{
    "id": _id,
    title,
    file
  }
}`;
