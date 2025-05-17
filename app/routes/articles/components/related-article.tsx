import type { Article } from "~/services.server/sanity/articles";
import {
  Card,
  CardTitle,
  // CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import { readingTime } from "reading-time-estimator";

export function RelatedArticleCard({ article }: { article: Article }) {
  const stats = readingTime(article.raw);
  // const MAX_EXCERPT_LENGTH = 100;
  return (
    <Link
      prefetch="intent"
      to={`/articles/${article.slug}`}
      className="group h-full"
    >
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
          {/* <CardDescription className="line-clamp-2">
            {article.excerpt.length > MAX_EXCERPT_LENGTH
              ? `${article.excerpt.slice(0, MAX_EXCERPT_LENGTH)}...`
              : article.excerpt}
          </CardDescription> */}
        </CardContent>
      </Card>
    </Link>
  );
}
