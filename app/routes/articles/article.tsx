import React from "react";
import type { Route } from "./+types/article";
import { DetailsHeader } from "./components/article-details-header";
import { Tags } from "./components/tags";
import { Share } from "./components/share";
import { Author } from "./components/author";
import { RelatedArticleCard } from "./components/related-article";
import { TableOfContent } from "./components/table-of-content";
import { SubscriptionForm } from "./components/subscription-form";
import { PopularTags } from "./components/popular-tags";
import { Markdown } from "~/components/mdx";
import {
  getArticleDetails,
  getPopularTags,
} from "~/services.server/sanity/articles";
// import { EngagementMetrics } from "~/components/engagement-metrics";
import { invariantResponse } from "~/utils/misc";
import { EmptyState } from "~/components/empty-state";
import { BookX } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Await } from "react-router";
import { Comments } from "~/components/comment";
import { Separator } from "~/components/ui/separator";
import { StatusCodes } from "http-status-codes";
import { getArticleMetadata } from "~/utils/articles.server";
import { z } from "zod";
import { prisma } from "~/utils/db.server";

const CommentSchema = z.object({
  comment: z.string(),
  articleId: z.string(),
  parentId: z.string().optional(),
  authorId: z.string(),
  intent: z.enum(["submit-comment", "submit-reply"]),
});

export async function loader({ params }: Route.LoaderArgs) {
  invariantResponse(params.articleSlug, "Article slug is required", {
    status: StatusCodes.BAD_REQUEST,
  });
  const popularTags = getPopularTags();
  const article = await getArticleDetails(params.articleSlug);
  const articleMetadata = await getArticleMetadata({
    articleId: article.id,
    commentTake: 5,
    replyTake: 3,
  });
  invariantResponse(article, "Article not found", {
    status: StatusCodes.NOT_FOUND,
  });
  return { popularTags, article, articleMetadata };
}

export async function action({ request }: Route.ActionArgs) {
  const result = await CommentSchema.safeParseAsync(
    Object.fromEntries(await request.formData()),
  );
  invariantResponse(result.success, "Invalid form data", {
    status: StatusCodes.BAD_REQUEST,
  });

  const data = result.data;

  switch (data.intent) {
    case "submit-comment":
      {
        const { comment, articleId, authorId } = data;
        await prisma.comment.create({
          data: {
            body: comment,
            author: {
              connect: { id: authorId },
            },
            content: {
              connectOrCreate: {
                where: {
                  sanityId: articleId,
                  type: "ARTICLE",
                },
                create: {
                  sanityId: articleId,
                  type: "ARTICLE",
                },
              },
            },
          },
        });
      }
      break;
    case "submit-reply":
      {
        const { comment, articleId, authorId, parentId } = data;
        await prisma.comment.create({
          data: {
            author: {
              connect: {
                id: authorId,
              },
            },
            parentId,
            body: comment,
            contentId: articleId,
          },
        });
      }
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
      <DetailsHeader article={article} />
      {/* Article content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
                <img
                  src={article.image}
                  alt={article.title}
                  className="aspect-video h-full w-full object-cover"
                />
              </div>
              <TableOfContent className="block lg:hidden" />
              <Markdown source={article.content} />
            </div>
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
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20">
              <TableOfContent className="hidden lg:block" />
              {/* {articleMetadata?.content ? (
                <EngagementMetrics metrics={articleMetadata.content} />
              ) : (
                <Skeleton className="mb-6 h-10" />
              )} */}
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
