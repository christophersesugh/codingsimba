import React from "react";
import type { Route } from "./+types/article";
import { DetailsHeader } from "../../components/details-header";
import { Tags } from "./components/tags";
import { Share } from "./components/share";
import { Author } from "../../components/author";
import { RelatedArticleCard } from "./components/related-article";
import { TableOfContent } from "../../components/table-of-content";
import { SubscriptionForm } from "./components/subscription-form";
import { PopularTags } from "./components/popular-tags";
import { Markdown } from "~/components/mdx";
import {
  getArticleDetails,
  getPopularTags,
} from "~/services.server/sanity/articles/utils";
import { EngagementMetrics } from "~/components/engagement-metrics";
import { invariant, invariantResponse } from "~/utils/misc";
import { EmptyState } from "~/components/empty-state";
import { BookX } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Await } from "react-router";
import { Comments } from "~/components/comment";
import { Separator } from "~/components/ui/separator";
import { StatusCodes } from "http-status-codes";
import { getArticleMetadata } from "~/utils/articles.server";
// import { prisma } from "~/utils/db.server";
import { UpdateSchema, type ContentIntent } from "~/hooks/content";
import { z } from "zod";

const SearchParamsSchema = z.object({
  commentTake: z.coerce.number().default(5),
  replyTake: z.coerce.number().default(3),
  intent: z.string().optional(),
});

export async function loader({ request, params }: Route.LoaderArgs) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  const parsedParams = SearchParamsSchema.safeParse(searchParams);

  invariant(params.articleSlug, "Article slug is required");

  invariantResponse(parsedParams.success, "Invalid comment search params", {
    status: StatusCodes.BAD_REQUEST,
  });

  const popularTags = getPopularTags();
  const article = await getArticleDetails(params.articleSlug);
  invariantResponse(article, `Article with slug: '${article.slug}' not found`, {
    status: StatusCodes.NOT_FOUND,
  });

  const articleMetadata = await getArticleMetadata({
    articleId: article.id,
    ...parsedParams.data,
  });

  return { popularTags, article, articleMetadata };
}

export async function action({ request }: Route.ActionArgs) {
  const result = await UpdateSchema.safeParseAsync(
    Object.fromEntries(await request.formData()),
  );
  invariantResponse(result.success, "Invalid form data", {
    status: StatusCodes.BAD_REQUEST,
  });

  const data = result.data;

  switch (data.intent as ContentIntent) {
    case "add-comment":
      break;
    case "update-comment":
      break;
    case "delete-comment":
      break;
    case "upvote-comment":
      break;
    case "add-reply":
      break;
    case "update-reply":
      break;
    case "delete-reply":
      break;
    case "upvote-reply":
      break;
    default:
      throw new Error("Invalid intent");
  }
  return {};
}

export default function ArticleDetailsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { article, popularTags, articleMetadata } = loaderData;

  return (
    <>
      <DetailsHeader item={article} />
      {/* Article content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main content */}
          <main className="lg:col-span-8">
            <article className="mb-8">
              <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
                <img
                  src={article.image}
                  alt={article.title}
                  className="aspect-video h-full w-full object-cover"
                />
              </div>
              <TableOfContent className="block lg:hidden" />
              <Markdown
                source={article.content}
                sandpackTemplates={article.sandpackTemplates}
              />
            </article>
            <Separator className="mb-4 mt-2" />
            <Comments
              articleId={article.id}
              comments={articleMetadata?.comments ?? []}
            />
            <Tags article={article} />
            <Share article={article} />
            <Author />

            {/* Related articles */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
              {!article.relatedArticles?.length ? (
                <EmptyState
                  icon={<BookX className="size-8" />}
                  title="No related articles found for this article"
                  className="mx-auto"
                />
              ) : null}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {article.relatedArticles?.length
                  ? article.relatedArticles.map((relatedArticle) => (
                      <RelatedArticleCard
                        key={relatedArticle.id}
                        article={relatedArticle}
                      />
                    ))
                  : null}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20">
              <TableOfContent className="hidden lg:block" />
              <EngagementMetrics metrics={articleMetadata?.metrics} />
              <SubscriptionForm />
              <React.Suspense
                fallback={Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} />
                ))}
              >
                <Await resolve={popularTags}>
                  {(tags) => <PopularTags popularTags={tags.data} />}
                </Await>
              </React.Suspense>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
