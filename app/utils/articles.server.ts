import { StatusCodes } from "http-status-codes";
import { prisma } from "./db.server";
import { bundleMDX } from "./mdx.server";
import { invariantResponse } from "./misc";
import type { Update } from "~/hooks/content";

/**
 * Retrieves metrics for a specific article including views, likes, and comment counts
 * @param articleId - The Sanity.io document ID of the article
 * @returns Object containing article metrics and likes, or undefined if article not found
 */
async function getArticleMetrics({ articleId }: { articleId: string }) {
  const contentMetrics = await prisma.content.findUnique({
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
  if (!contentMetrics) return;
  //WE DON'T WANNA PASS THE USER ID, WE WANNA GET CURRENT USER LIKES ON THE CLIENT
  const likes = await prisma.like.findMany({
    where: { contentId: contentMetrics.id },
    select: { count: true, userId: true },
  });
  return { ...contentMetrics, likes };
}

/**
 * Retrieves comments and their replies for a specific article
 * @param articleId - The content ID of the article
 * @param commentTake - Number of comments to retrieve
 * @param replyTake - Number of replies to retrieve per comment
 * @returns Array of comments with their associated replies and author information
 */
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
      likes: {
        select: { count: true, userId: true },
      },
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
          likes: {
            select: { count: true, userId: true },
          },
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

/**
 * Retrieves complete article metadata including metrics and processed comments
 * @param articleId - The Sanity.io document ID of the article
 * @param commentTake - Number of comments to retrieve
 * @param replyTake - Number of replies to retrieve per comment
 * @returns Object containing article metrics and processed comments, or null if article not found
 */
export async function getArticleMetadata({
  articleId,
  commentTake,
  replyTake,
}: {
  articleId: string;
  commentTake: number;
  replyTake: number;
}) {
  const metrics = await getArticleMetrics({ articleId });
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
      raw: comment.body,
      body: (await bundleMDX({ source: comment.body })).code,
      replies: await Promise.all(
        (comment.replies || []).map(async (reply) => ({
          ...reply,
          raw: reply.body,
          body: (await bundleMDX({ source: reply.body })).code,
        })),
      ),
    })),
  );

  return { metrics, comments } as const;
}

/**
 * Adds a new comment to an article
 * @param itemId - The Sanity.io document ID of the article
 * @param body - The comment content
 * @param userId - The ID of the user creating the comment
 * @returns The created comment
 */
export async function addComment({ itemId, body, userId }: Update) {
  invariantResponse(body, "Comment body is required to add  a comment", {
    status: StatusCodes.BAD_REQUEST,
  });
  const article = await prisma.content.upsert({
    where: { sanityId: itemId },
    create: { sanityId: itemId, type: "ARTICLE" },
    update: {},
    select: { id: true },
  });

  const comment = await prisma.comment.create({
    data: {
      body: body!,
      contentId: article.id,
      authorId: userId,
      parentId: null,
    },
    select: { id: true },
  });
  return comment;
}

/**
 * Adds a reply to an existing comment
 * @param itemId - The Sanity.io document ID of the article
 * @param body - The reply content
 * @param userId - The ID of the user creating the reply
 * @param parentId - The ID of the parent comment
 * @returns The created reply
 */
export async function addReply({ itemId, body, userId, parentId }: Update) {
  invariantResponse(parentId, "Parent ID is required to reply to a comment", {
    status: StatusCodes.BAD_REQUEST,
  });
  invariantResponse(body, "Reply content is required to update a reply", {
    status: StatusCodes.BAD_REQUEST,
  });
  const article = await prisma.content.upsert({
    where: { sanityId: itemId },
    create: { sanityId: itemId, type: "ARTICLE" },
    update: {},
    select: { id: true },
  });

  const reply = await prisma.comment.create({
    data: {
      body,
      contentId: article.id,
      authorId: userId,
      parentId,
    },
    select: { id: true },
  });
  return reply;
}

/**
 * Updates an existing comment
 * @param itemId - The ID of the comment to update
 * @param body - The new comment content
 * @param userId - The ID of the user updating the comment
 * @returns The updated comment
 * @throws {Error} If comment not found or user not authorized
 */
export async function updateComment({ itemId, body, userId }: Update) {
  const comment = await prisma.comment.findUnique({
    where: { id: itemId },
    select: { authorId: true },
  });

  invariantResponse(comment, "Comment not found", {
    status: StatusCodes.NOT_FOUND,
  });

  invariantResponse(
    comment.authorId === userId,
    "Not authorized to update this comment",
    {
      status: StatusCodes.FORBIDDEN,
    },
  );

  const updatedComment = await prisma.comment.update({
    where: { id: itemId },
    data: { body },
    select: { id: true },
  });

  return updatedComment;
}

/**
 * Deletes a comment
 * @param itemId - The ID of the comment to delete
 * @param userId - The ID of the user deleting the comment
 * @returns Object indicating successful deletion
 * @throws {Error} If comment not found or user not authorized
 */
export async function deleteComment({ itemId, userId }: Omit<Update, "body">) {
  const comment = await prisma.comment.findUnique({
    where: { id: itemId },
    select: { authorId: true },
  });

  invariantResponse(comment, "Comment not found", {
    status: StatusCodes.NOT_FOUND,
  });

  invariantResponse(
    comment.authorId === userId,
    "Not authorized to delete this comment",
    {
      status: StatusCodes.FORBIDDEN,
    },
  );

  await prisma.comment.delete({
    where: { id: itemId },
  });

  return { success: true };
}

/**
 * Toggles upvote status for a comment
 * @param itemId - The ID of the comment to upvote
 * @param userId - The ID of the user upvoting
 * @returns The updated like record
 */
export async function upvoteComment({ itemId, userId }: Omit<Update, "body">) {
  invariantResponse(itemId, "Item ID is required", {
    status: StatusCodes.NOT_FOUND,
  });
  const upsertLike = await prisma.like.upsert({
    where: { commentId_userId: { commentId: itemId, userId } },
    update: { count: { increment: 1 } },
    create: { commentId: itemId, userId, count: 1 },
    select: { id: true },
  });
  return upsertLike;
}

/**
 * Updates an existing reply
 * @param itemId - The ID of the reply to update
 * @param body - The new reply content
 * @param userId - The ID of the user updating the reply
 * @returns The updated reply
 * @throws {Error} If reply not found, not a reply, or user not authorized
 */
export async function updateReply({ itemId, body, userId }: Update) {
  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
    select: { authorId: true, parentId: true },
  });

  invariantResponse(reply, "Reply not found", {
    status: StatusCodes.NOT_FOUND,
  });

  invariantResponse(reply.parentId, "This is not a reply", {
    status: StatusCodes.BAD_REQUEST,
  });

  invariantResponse(
    reply.authorId === userId,
    "Not authorized to update this reply",
    {
      status: StatusCodes.FORBIDDEN,
    },
  );

  const updatedReply = await prisma.comment.update({
    where: { id: itemId },
    data: { body },
    select: { id: true },
  });

  return updatedReply;
}

/**
 * Deletes a reply
 * @param itemId - The ID of the reply to delete
 * @param userId - The ID of the user deleting the reply
 * @returns Object indicating successful deletion
 * @throws {Error} If reply not found, not a reply, or user not authorized
 */
export async function deleteReply({ itemId, userId }: Omit<Update, "body">) {
  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
    select: { authorId: true, parentId: true },
  });

  invariantResponse(reply, "Reply not found", {
    status: StatusCodes.NOT_FOUND,
  });

  invariantResponse(reply.parentId, "This is not a reply", {
    status: StatusCodes.BAD_REQUEST,
  });

  invariantResponse(
    reply.authorId === userId,
    "Not authorized to delete this reply",
    {
      status: StatusCodes.FORBIDDEN,
    },
  );

  await prisma.comment.delete({
    where: { id: itemId },
  });

  return { success: true };
}

/**
 * Toggles upvote status for a reply
 * @param itemId - The ID of the reply to upvote
 * @param userId - The ID of the user upvoting
 * @returns The updated like record
 * @throws {Error} If not a reply
 */
export async function upvoteReply({ itemId, userId }: Omit<Update, "body">) {
  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
    select: { parentId: true },
  });

  invariantResponse(reply?.parentId, "This is not a reply", {
    status: StatusCodes.BAD_REQUEST,
  });

  const updatedReply = await prisma.like.upsert({
    where: { commentId_userId: { commentId: itemId, userId } },
    update: { count: { increment: 1 } },
    create: { commentId: itemId, userId, count: 1 },
    select: { id: true },
  });

  return updatedReply;
}

/**
 * Toggles upvote status for an article
 * @param itemId - The ID of the article to upvote
 * @param userId - The ID of the user upvoting
 * @returns The updated like record
 */
export async function upvoteArticle({ itemId, userId }: Omit<Update, "body">) {
  invariantResponse(itemId, "Item ID is required", {
    status: StatusCodes.NOT_FOUND,
  });
  const upsertLike = await prisma.like.upsert({
    where: { contentId_userId: { contentId: itemId, userId } },
    update: { count: { increment: 1 } },
    create: { contentId: itemId, userId, count: 1 },
    select: { id: true },
  });
  return upsertLike;
}

/**
 * Tracks a page view for an article
 * @param itemId - The Sanity.io document ID of the article
 * @returns The updated content record with view count
 */
export async function trackPageView({ itemId }: { itemId: string }) {
  const content = await prisma.content.upsert({
    where: { sanityId: itemId },
    create: { sanityId: itemId, type: "ARTICLE", views: 1 },
    update: { views: { increment: 1 } },
    select: { id: true },
  });

  return content;
}
