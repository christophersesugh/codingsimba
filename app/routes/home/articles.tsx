import React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArticleCard } from "~/components/article-card";
import { Link } from "react-router";

export function ArticlesSection() {
  return (
    <section
      id="articles"
      className="relative overflow-hidden bg-gray-100/30 py-24 dark:bg-gray-800/10"
    >
      <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Latest Articles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            In-depth articles and tutorials to help you stay ahead.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-8">
            <Link to={"/articles"} prefetch="intent">
              View All Articles
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const articles = [
  {
    title: "Understanding React Server Components",
    excerpt:
      "Dive deep into React Server Components and learn how they can improve your application's performance.",
    image: "/placeholder.svg?height=300&width=600&text=Server+Components",
    date: "August 3, 2023",
    readTime: "8 min read",
    category: "React",
    author: {
      name: "Coding Simba",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
    },
  },
  {
    title: "Building a Design System with React and Tailwind",
    excerpt:
      "A comprehensive guide to creating a consistent and maintainable design system for your applications.",
    image: "/placeholder.svg?height=300&width=600&text=Design+System",
    date: "June 15, 2023",
    readTime: "12 min read",
    category: "Design",
    author: {
      name: "Coding Simba",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
    },
  },
  {
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt:
      "Level up your TypeScript skills with these advanced patterns specifically for React applications.",
    image: "/placeholder.svg?height=300&width=600&text=TypeScript",
    date: "September 21, 2023",
    readTime: "15 min read",
    category: "TypeScript",
    author: {
      name: "Coding Simba",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
    },
  },
  {
    title: "Optimizing Next.js Applications for Performance",
    excerpt:
      "Learn how to make your Next.js applications blazing fast with these optimization techniques.",
    image: "/placeholder.svg?height=300&width=600&text=Performance",
    date: "October 5, 2023",
    readTime: "10 min read",
    category: "Next.js",
    author: {
      name: "Coding Simba",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
    },
  },
];
