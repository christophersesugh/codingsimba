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
import { Badge } from "~/components/ui/badge";
import { CardBadge } from "./card-badge";
import { Button } from "./ui/button";
import { Link } from "react-router";

interface ArticleCardProps {
  article: {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    readTime: string;
    category: string;
    author: {
      name: string;
      avatar: string;
    };
  };
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
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
              src={"https://placehold.co/600x400"}
              alt={article.title}
              width={600}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <CardBadge>{article.category}</CardBadge>
        </CardHeader>

        <CardContent className="p-6">
          <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-full">
                <img
                  src={"https://placehold.co/24x24"}
                  alt={article.author.name}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
              <span>{article.author.name}</span>
            </div>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Article title and excerpt */}
          <CardTitle className="group-hover:text-primary mb-2 transition-colors">
            {article.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {article.excerpt}
          </CardDescription>
        </CardContent>

        {/* Read more link */}
        <CardFooter className="flex pt-0">
          <Button
            asChild
            variant={"link"}
            className="flex w-full items-center justify-start font-medium text-blue-600 dark:text-blue-600"
          >
            <Link to={"/articles/1"} prefetch="intent">
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
