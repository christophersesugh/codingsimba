import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FilePenLine, Heart, Loader, Trash2 } from "lucide-react";
import { cn } from "~/lib/shadcn";
import { formatDistanceToNowStrict } from "date-fns";
import { Markdown } from "../mdx";
import { useOptionalUser } from "~/hooks/user";
import { useUpvote, useDelete, useUpdate } from "~/hooks/content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { CommentForm } from "./comment-form";
import { useNavigate } from "react-router";
import { getImgSrc, getInitials, requireAuth } from "~/utils/misc";
import { userHasPermission } from "~/utils/permissions";
import type { CommentData } from "./comment";

type ReplyData = NonNullable<CommentData["replies"]>[0];

export function Reply({ reply }: { reply: ReplyData }) {
  const [replyBody, setReplyBody] = React.useState(reply.html);
  const [editReply, setEditReply] = React.useState(false);
  const navigate = useNavigate();
  const user = useOptionalUser();

  const author = reply?.author;
  const userId = user?.id;
  const isOwner = userId === reply.authorId;

  const isLiked = reply.likes?.some((like) => like.userId === userId);
  const totalLikes = reply?.likes?.reduce(
    (total, like) => total + like.count,
    0,
  );

  const canDelete = userHasPermission(
    user,
    isOwner ? "DELETE:REPLY:OWN" : "DELETE:REPLY:ANY",
  );
  const canUpdate = userHasPermission(
    user,
    isOwner ? "UPDATE:REPLY:OWN" : "UPDATE:REPLY:ANY",
  );

  const {
    submit: deleteReply,
    isPending: isDeleting,
    submittedItemId: deletedItemId,
  } = useDelete({
    itemId: reply.id,
    intent: "delete-reply",
    userId: userId!,
  });

  const isDeletingReply = isDeleting && deletedItemId === reply.id;

  const {
    submit: upvoteReply,
    isPending: isUpvoting,
    submittedItemId: upvotedItemId,
  } = useUpvote({
    itemId: reply.id,
    intent: "upvote-reply",
    userId: userId!,
  });
  const isUpvotingReply = isUpvoting && upvotedItemId === reply.id;

  const {
    submit: updateReply,
    isPending: isUpdating,
    submittedItemId: updatedItemId,
  } = useUpdate({
    itemId: reply.id,
    userId: userId!,
    body: replyBody,
    intent: "update-reply",
  });
  const isUpdatingReply = isUpdating && updatedItemId === reply.id;

  function handleUpdateReply() {
    if (!replyBody) return;
    updateReply();
    setEditReply(false);
  }

  const basicButtonClasses =
    "space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
  return (
    <li>
      <div className="overflow-hidden">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Avatar className="size-6 border border-gray-300 dark:border-gray-600">
              <AvatarImage
                src={getImgSrc({
                  path: "users",
                  fileKey: author?.image?.fileKey,
                  seed: author?.id,
                })}
                alt={author!.name}
              />
              <AvatarFallback>{getInitials(author!.name!)}</AvatarFallback>
            </Avatar>
            <h5 className="text-sm font-medium">{author!.name}</h5>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNowStrict(new Date(reply.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {editReply ? (
          <CommentForm
            isForUpdate
            comment={replyBody}
            setComment={setReplyBody}
            onSubmit={handleUpdateReply}
            onCancel={() => setEditReply(false)}
          />
        ) : (
          <div className="overflow-x-auto">
            <Markdown source={reply.body} className="py-1 !text-sm" />
          </div>
        )}
        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={requireAuth({ fn: upvoteReply, user, navigate })}
            className={cn(basicButtonClasses, "flex items-center")}
            aria-label={isUpvotingReply ? "Upvoting" : "Upvote"}
          >
            <Heart
              className={cn("size-4", {
                "fill-red-500 text-red-500": isLiked,
                "animate-bounce": isUpvotingReply,
              })}
            />
            <span>{totalLikes}</span>
          </button>

          {canUpdate ? (
            <button
              onClick={() => setEditReply(!editReply)}
              disabled={isUpdatingReply}
              className={basicButtonClasses}
              aria-label={isUpdatingReply ? "Updating" : "Update"}
            >
              {isUpdatingReply ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <FilePenLine className="size-4 text-blue-600 dark:text-blue-500" />
              )}
            </button>
          ) : null}
          {canDelete ? (
            <AlertDialog>
              <AlertDialogTrigger disabled={isDeletingReply}>
                {isDeletingReply ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4 text-red-600 dark:text-red-500" />
                )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this reply?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteReply}>
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </div>
    </li>
  );
}
