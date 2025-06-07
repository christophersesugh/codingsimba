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
import { Await, useFetcher } from "react-router";
import { Comments } from "~/components/comment";
import { Separator } from "~/components/ui/separator";
import { StatusCodes } from "http-status-codes";
import {
  addComment,
  addReply,
  updateComment,
  deleteComment,
  upvoteComment,
  updateReply,
  deleteReply,
  upvoteReply,
  trackPageView,
  upvoteArticle,
  getArticleMetrics,
  getArticleComments,
} from "~/utils/articles.server";
import { UpdateSchema } from "~/hooks/content";
import { z } from "zod";
import { useOptionalUser } from "~/hooks/user";
import { usePageView, type PageViewData } from "use-page-view";
import { getUserId } from "~/utils/auth.server";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { determinePermissions } from "~/utils/permissions.server";

const SearchParamsSchema = z.object({
  commentTake: z.coerce.number().default(5),
  replyTake: z.coerce.number().default(3),
  intent: z.string().optional(),
});

export async function loader({ request, params }: Route.LoaderArgs) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  const parsedParams = await SearchParamsSchema.safeParseAsync(searchParams);

  invariant(params.articleSlug, "Article slug is required");

  invariantResponse(parsedParams.success, "Invalid comment search params", {
    status: StatusCodes.BAD_REQUEST,
  });

  const popularTags = getPopularTags();
  const userId = await getUserId(request);
  const article = await getArticleDetails(params.articleSlug);
  invariantResponse(article, `Article with slug: '${article.slug}' not found`, {
    status: StatusCodes.NOT_FOUND,
  });

  const metrics = getArticleMetrics({
    articleId: article.id,
  });

  const articleComments = getArticleComments({
    articleId: article.id,
    ...parsedParams.data,
  });

  const comments = (await articleComments) ?? [];
  const replies = comments.flatMap((comment) => comment.replies ?? []);

  const commentPermissions = userId
    ? [
        ...(await determinePermissions({
          userId,
          entity: "COMMENT",
          entityArray: comments,
        })),
        ...(await determinePermissions({
          userId,
          entity: "COMMENT",
          entityArray: replies,
        })),
      ]
    : [];

  const commentPermissionMap = new Map(
    commentPermissions.map((p) => [p.commentId, p]),
  );

  return {
    popularTags,
    metrics,
    comments: articleComments,
    article,
    commentPermissionMap,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const result = await UpdateSchema.safeParseAsync(
    Object.fromEntries(await request.formData()),
  );
  invariantResponse(result.success, "Invalid form data", {
    status: StatusCodes.BAD_REQUEST,
  });

  const data = result.data;

  switch (data.intent) {
    case "add-comment":
      return await addComment(data);
    case "add-reply":
      return await addReply(data);
    case "update-comment":
      return await updateComment(data);
    case "delete-comment":
      return await deleteComment(data);
    case "upvote-comment":
      return await upvoteComment(data);
    case "update-reply":
      return await updateReply(data);
    case "delete-reply":
      return await deleteReply(data);
    case "upvote-reply":
      return await upvoteReply(data);
    case "upvote-article":
      return await upvoteArticle(data);
    case "track-page-view":
      return await trackPageView(data);

    default:
      throw new Error("Invalid intent");
  }
}

export default function ArticleDetailsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { popularTags, comments, metrics, article, commentPermissionMap } =
    loaderData;
  const user = useOptionalUser();
  const fetcher = useFetcher();

  const handlePageView = React.useCallback(async (data: PageViewData) => {
    await fetcher.submit(
      { ...data, itemId: data.pageId, intent: "track-page-view" },
      { method: "post" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageData = usePageView({
    pageId: article.id,
    userId: user?.id ?? undefined,
    trackOnce: true,
    trackOnceDelay: 10,
    minTimeThreshold: 10,
    heartbeatInterval: 30,
    onPageView: handlePageView,
  });

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
              <TableOfContent pageData={pageData} className="block lg:hidden" />
              <Markdown
                source={article.content}
                sandpackTemplates={article.sandpackTemplates}
              />
            </article>
            <p>
              Comment below the topics you may like me to create articles or
              tutorials on!
            </p>
            <Separator className="mb-4 mt-2" />

            <Comments
              articleId={article.id}
              comments={comments}
              permissionMap={commentPermissionMap}
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
              <TableOfContent pageData={pageData} className="hidden lg:block" />
              <EngagementMetrics metrics={metrics} />
              {!user?.isSubscribed ? <SubscriptionForm /> : null}
              <React.Suspense
                fallback={Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} />
                ))}
              >
                <Await resolve={popularTags}>
                  {(tags) => <PopularTags popularTags={tags} />}
                </Await>
              </React.Suspense>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        403: () => <p>You do not have permission</p>,
        404: ({ params }) => (
          <p>Article with ${params.articleId} does not exist</p>
        ),
      }}
    />
  );
}
