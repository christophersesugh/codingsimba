import type { Route } from "../+types/article";
import { Card, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link, PrefetchPageLinks, useLoaderData } from "react-router";
import { readingTime } from "reading-time-estimator";
import { EmptyState } from "~/components/empty-state";
import { BookX } from "lucide-react";

export interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  createdAt: string;
  category: {
    id: string;
    slug: string;
    title: string;
  };
  markdown: string;
}

export function RelatedArticles() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];
  const relatedArticles = loaderData.article.relatedArticles;
  if (!relatedArticles?.length) {
    return (
      <EmptyState
        icon={<BookX className="size-8" />}
        title="No related articles found for this article"
        className="mx-auto"
      />
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {relatedArticles.map((article) => (
        <RelatedArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function RelatedArticleCard({ article }: { article: RelatedArticle }) {
  const stats = readingTime(article.markdown);

  return (
    <Link
      prefetch="intent"
      to={`/articles/${article.slug}`}
      className="group h-full"
    >
      <PrefetchPageLinks page={`/articles/${article.slug}`} />
      <Card className="h-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-video h-[180px] max-h-[180px]">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="mb-auto">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {article.category.title}
            </Badge>
            <span className="text-muted-foreground text-xs">
              ~ {stats.text}
            </span>
          </div>
          <CardTitle className="group-hover:text-primary mb-2 line-clamp-2">
            {article.title}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
