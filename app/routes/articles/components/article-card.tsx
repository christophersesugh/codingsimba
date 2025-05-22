import type { Article } from "~/services.server/sanity/articles";
import { readingTime } from "reading-time-estimator";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { CardBadge } from "../../../components/card-badge";
import { Button } from "../../../components/ui/button";
import { format } from "date-fns";

type ArticleCardProps = {
  article: Article;
  index: number;
};

export function ArticleCard({ article, index }: ArticleCardProps) {
  const stats = readingTime(article.raw);
  const MAX_EXCERPT_LENGTH = 150;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Card className="h-full overflow-hidden pt-0 transition-shadow duration-300 hover:shadow-md">
        <CardHeader className="relative p-0">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              width={600}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <CardBadge className="capitalize">{article.category.title}</CardBadge>
        </CardHeader>

        <CardContent className="-mb-2">
          <div className="mb-3 flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{format(article.createdAt, "MMMM dd, yyyy")}</span>
            <span>{stats.text}</span>
          </div>

          {/* Article title and excerpt */}
          <CardTitle className="group-hover:text-primary mb-2 text-lg transition-colors">
            {article.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {article.excerpt.length > MAX_EXCERPT_LENGTH
              ? `${article.excerpt.slice(0, MAX_EXCERPT_LENGTH)}...`
              : article.excerpt}
          </CardDescription>
        </CardContent>

        <CardFooter className="-mb-4 mt-auto flex justify-between pl-3 pt-0">
          <Button
            variant={"link"}
            className="flex w-full items-center justify-start font-medium text-blue-600 dark:text-blue-600"
          >
            Read Article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
