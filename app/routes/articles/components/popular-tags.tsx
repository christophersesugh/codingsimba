import React from "react";
import type { Route } from "../+types/article";
import { Await, Link, useLoaderData } from "react-router";
import type { Tag } from "~/services.server/sanity/articles/types";
import { Skeleton } from "~/components/ui/skeleton";

export function PopularTags() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];
  return (
    <React.Suspense
      fallback={Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    >
      <Await resolve={loaderData.popularTags}>
        {(tags) => (tags?.length ? <Tags tags={tags} /> : null)}
      </Await>
    </React.Suspense>
  );
}

function Tags({ tags }: { tags: Tag[] }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-bold">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
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
    </section>
  );
}
