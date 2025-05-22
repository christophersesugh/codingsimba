import type { Article } from "~/services.server/sanity/articles";
import { Link } from "react-router";
import { format } from "date-fns";
import { readingTime } from "reading-time-estimator";

export function FeaturedArticle({ article }: { article: Article }) {
  const stats = readingTime(article.raw);
  const MAX_EXCERPT_LENGTH = 200;
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group mb-12 block"
      prefetch="intent"
    >
      <article className="grid gap-8 overflow-hidden rounded-2xl bg-gray-100 md:h-[300px] md:max-h-[300px] md:grid-cols-2 dark:bg-gray-900">
        <div className="relative aspect-video md:aspect-auto md:h-[300px] md:max-h-[300px]">
          <img
            src={article.image}
            alt={article.title}
            className="h-full min-h-full w-full object-fill transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
              Featured
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 md:h-full">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {article.category.title}
            </span>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              {format(article.createdAt, "MMMM dd, yyyy")}
            </span>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              ~ {stats.text}
            </span>
          </div>
          <h2 className="mb-4 text-2xl font-bold transition-colors group-hover:text-blue-600 md:text-3xl dark:group-hover:text-blue-400">
            {article.title}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {article.excerpt.length > MAX_EXCERPT_LENGTH
              ? `${article.excerpt.slice(0, MAX_EXCERPT_LENGTH)}...`
              : article.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
