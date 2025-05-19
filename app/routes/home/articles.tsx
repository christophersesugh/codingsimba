import type { Article } from "~/services.server/sanity/articles";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArticleCard } from "~/routes/articles/components/article-card";
import { Await, Link } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";

export function ArticlesSection({
  articles,
}: {
  articles: Promise<Article[]>;
}) {
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
          <React.Suspense
            fallback={Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          >
            <Await resolve={articles}>
              {(articles) =>
                articles.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    prefetch="intent"
                  >
                    <ArticleCard article={article} index={index} />
                  </Link>
                ))
              }
            </Await>
          </React.Suspense>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-8">
            <Link to={"articles"} prefetch="intent">
              View All Articles
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
