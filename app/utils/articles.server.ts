import { StatusCodes } from "http-status-codes";
import { prisma } from "./db.server";
import { bundleMDX } from "./mdx.server";
import { invariantResponse } from "./misc";
import type { Update } from "~/hooks/content";
import { MarkdownConverter } from "./misc.server";
import { determinePermissions } from "./permissions.server";

/**
 * LOADER FUNCTIONS
 */

/**
 * Retrieves metrics for a specific article including views, likes, and comment counts
 * @param articleId - The Sanity.io document ID of the article
 * @returns Object containing article metrics and likes, or undefined if article not found
 */
export async function getArticleMetrics({ articleId }: { articleId: string }) {
  return await prisma.content.findUnique({
    where: {
      sanityId: articleId,
      type: "ARTICLE",
    },
    select: {
      id: true,
      views: true,
      likes: {
        select: {
          count: true,
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
}

/**
 * Retrieves comments and their replies for a specific article
 * @param articleId - The content ID of the article
 * @param commentTake - Number of comments to retrieve
 * @param replyTake - Number of replies to retrieve per comment
 * @returns Array of comments with their associated replies and author information
 */
export async function getArticleComments({
  articleId,
  commentTake,
  replyTake,
}: {
  articleId: string;
  commentTake: number;
  replyTake: number;
}) {
  const comments = await prisma.comment.findMany({
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

  return await Promise.all(
    comments?.map(async (comment) => ({
      ...comment,
      raw: await MarkdownConverter.toHtml(comment.body),
      body: (await bundleMDX({ source: comment.body })).code,
      replies: await Promise.all(
        (comment.replies || []).map(async (reply) => ({
          ...reply,
          raw: await MarkdownConverter.toHtml(reply.body),
          body: (await bundleMDX({ source: reply.body })).code,
        })),
      ),
    })) ?? [],
  );
}

/**
 * ACTION FUNCTIONS
 */

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
      body: MarkdownConverter.toMarkdown(body!),
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
      parentId,
      authorId: userId,
      contentId: article.id,
      body: MarkdownConverter.toMarkdown(body!),
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
 * @description Checks user permissions using determinePermissions and verifies UPDATE permission
 */
export async function updateComment({ itemId, body, userId }: Update) {
  invariantResponse(body, "Comment body is required", {
    status: StatusCodes.BAD_REQUEST,
  });

  const comment = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariantResponse(comment, "Comment not found", {
    status: StatusCodes.NOT_FOUND,
  });

  const commentPermissions = userId
    ? await determinePermissions({
        userId,
        entity: "COMMENT",
        entityArray: [comment],
      })
    : [];
  const userPermissions = commentPermissions[0];

  const hasUpdatePermission = userPermissions?.permissions.some(
    (p) => p.action === "UPDATE",
  );

  invariantResponse(
    hasUpdatePermission,
    "Unauthorized: You don't have permission to update this comment",
    { status: StatusCodes.FORBIDDEN },
  );

  const updatedComment = await prisma.comment.update({
    where: { id: itemId },
    data: { body: MarkdownConverter.toMarkdown(body) },
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
 * @description Checks user permissions using determinePermissions and verifies DELETE permission
 */
export async function deleteComment({ itemId, userId }: Omit<Update, "body">) {
  invariantResponse(userId, "User ID is required", {
    status: StatusCodes.NOT_FOUND,
  });
  const comment = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariantResponse(comment, "Comment not found", {
    status: StatusCodes.NOT_FOUND,
  });

  const commentPermissions = userId
    ? await determinePermissions({
        userId,
        entity: "COMMENT",
        entityArray: [comment],
      })
    : [];
  const userPermissions = commentPermissions[0];

  const hasDeletePermission = userPermissions?.permissions.some(
    (p) => p.action === "DELETE",
  );

  invariantResponse(
    hasDeletePermission,
    "Unauthorized: You don't have permission to delete this comment",
    { status: StatusCodes.FORBIDDEN },
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
 * @description Checks user permissions using determinePermissions and verifies UPDATE permission
 */
export async function updateReply({ itemId, body, userId }: Update) {
  invariantResponse(userId, "User ID is required", {
    status: StatusCodes.BAD_REQUEST,
  });

  invariantResponse(body, "Reply body is required", {
    status: StatusCodes.BAD_REQUEST,
  });

  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariantResponse(reply, "Reply not found", {
    status: StatusCodes.NOT_FOUND,
  });

  invariantResponse(reply.parentId, "This is not a reply", {
    status: StatusCodes.BAD_REQUEST,
  });

  const commentPermissions = userId
    ? await determinePermissions({
        userId,
        entity: "COMMENT",
        entityArray: [reply],
      })
    : [];
  const userPermissions = commentPermissions[0];

  const hasUpdatePermission = userPermissions?.permissions.some(
    (p) => p.action === "UPDATE",
  );

  invariantResponse(
    hasUpdatePermission,
    "Unauthorized: You don't have permission to update this reply",
    { status: StatusCodes.FORBIDDEN },
  );

  const updatedReply = await prisma.comment.update({
    where: { id: itemId },
    data: { body: MarkdownConverter.toMarkdown(body) },
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
 * @description Checks user permissions using determinePermissions and verifies DELETE permission
 */
export async function deleteReply({ itemId, userId }: Omit<Update, "body">) {
  invariantResponse(userId, "User ID is required", {
    status: StatusCodes.BAD_REQUEST,
  });

  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariantResponse(reply, "Reply not found", {
    status: StatusCodes.NOT_FOUND,
  });

  invariantResponse(reply.parentId, "This is not a reply", {
    status: StatusCodes.BAD_REQUEST,
  });

  const commentPermissions = userId
    ? await determinePermissions({
        userId,
        entity: "COMMENT",
        entityArray: [reply],
      })
    : [];
  const userPermissions = commentPermissions[0];

  const hasDeletePermission = userPermissions?.permissions.some(
    (p) => p.action === "DELETE",
  );

  invariantResponse(
    hasDeletePermission,
    "Unauthorized: You don't have permission to delete this reply",
    { status: StatusCodes.FORBIDDEN },
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
