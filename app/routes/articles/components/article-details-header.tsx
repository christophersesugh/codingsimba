import type { Article } from "~/services.server/sanity/articles";
import { Link } from "react-router";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { readingTime } from "reading-time-estimator";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export function DetailsHeader({ article }: { article: Article }) {
  const stats = readingTime(article.raw);
  return (
    <div className="border-b border-gray-200 bg-blue-50 pb-16 pt-24 dark:border-gray-800 dark:bg-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to={"/articles"} className="text-lg">
                  Articles
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg">
                  {article.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {article.category.title}
            </span>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{format(article.createdAt, "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="mr-1 h-4 w-4" />
              <span>~ {stats.text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
