import { StatusCodes } from "http-status-codes";
import type { Update } from "~/hooks/content";
import { prisma } from "~/utils/db.server";
import { invariant, invariantResponse } from "~/utils/misc";
import { MarkdownConverter } from "~/utils/misc.server";
import { determinePermissions } from "~/utils/permissions.server";

/**
 * Adds a new comment to an article
 * @param itemId - The Sanity.io document ID of the article
 * @param body - The comment content
 * @param userId - The ID of the user creating the comment
 * @returns The created comment
 */
export async function addComment({ itemId, body, userId }: Update) {
  invariant(body, "Comment body is required to add  a comment");
  const article = await prisma.content.upsert({
    where: { sanityId: itemId },
    create: { sanityId: itemId, type: "ARTICLE" },
    update: {},
    select: { id: true },
  });

  const comment = await prisma.comment.create({
    data: {
      body: MarkdownConverter.toMarkdown(body),
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
  invariant(parentId, "Parent ID is required to reply to a comment");
  invariant(body, "Reply content is required to update a reply");
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
  invariant(body, "Comment body is required");

  const comment = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariant(comment, "Comment not found");

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
  invariant(userId, "User ID is required");
  const comment = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariant(comment, "Comment not found");

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
  invariant(itemId, "Item ID is required");
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
  invariant(userId, "User ID is required");
  invariant(body, "Reply body is required");

  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariant(reply, "Reply not found");
  invariant(reply.parentId, "This is not a reply");

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
  invariant(userId, "User ID is required");

  const reply = await prisma.comment.findUnique({
    where: { id: itemId },
  });

  invariant(reply, "Reply not found");
  invariant(reply.parentId, "This is not a reply");

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

  invariant(reply?.parentId, "This is not a reply");

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
  invariant(itemId, "Item ID is required");
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
