import type { Tag } from "~/services.server/sanity/articles/types";
import { Link } from "react-router";

export function Tags({ article }: { article: { tags: Tag[] } }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <Link
            key={tag.id}
            prefetch="intent"
            to={{
              pathname: "/articles",
              search: `?tag=${tag.slug}`,
            }}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            #{tag.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
