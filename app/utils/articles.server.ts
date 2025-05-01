import { prisma } from "./db.server";
import { bundleMDX } from "./mdx.server";

async function getArticle(articleId: string) {
  return prisma.content.findUnique({
    where: {
      sanityId: articleId,
      type: "ARTICLE",
    },
    select: {
      id: true,
      views: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
}

async function getArticleComments({
  articleId,
  commentTake,
  replyTake,
}: {
  articleId: string;
  commentTake: number;
  replyTake: number;
}) {
  return prisma.comment.findMany({
    where: {
      contentId: articleId,
      parentId: null,
    },
    select: {
      id: true,
      body: true,
      likes: true,
      createdAt: true,
      authorId: true,
      parentId: true,
      contentId: true,
      author: {
        select: {
          id: true,
          profile: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      replies: {
        select: {
          id: true,
          body: true,
          likes: true,
          createdAt: true,
          authorId: true,
          parentId: true,
          contentId: true,
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        take: replyTake,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    take: commentTake,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getArticleMetadata({
  articleId,
  commentTake,
  replyTake,
}: {
  articleId: string;
  commentTake: number;
  replyTake: number;
}) {
  const metrics = await getArticle(articleId);
  if (!metrics) {
    return null;
  }
  const comments = await Promise.all(
    (
      await getArticleComments({
        articleId: metrics.id,
        commentTake,
        replyTake,
      })
    ).map(async (comment) => ({
      ...comment,
      body: (await bundleMDX({ source: comment.body })).code,
      replies: await Promise.all(
        (comment.replies || []).map(async (reply) => ({
          ...reply,
          body: (await bundleMDX({ source: reply.body })).code,
        })),
      ),
    })),
  );

  return { metrics, comments } as const;
}
