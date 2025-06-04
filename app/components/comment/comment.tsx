import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { formatDistanceToNowStrict } from "date-fns";
import type { PermissionMap, IComment } from ".";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  FilePenLine,
  Heart,
  MessageSquareQuote,
  Trash2,
  ChevronDown,
  Loader,
} from "lucide-react";
import { Reply } from "./reply";
import { CommentForm } from "./comment-form";
import { Markdown } from "../mdx";
import { useOptionalUser } from "~/hooks/user";
import { useUpvote, useDelete, useCreate, useUpdate } from "~/hooks/content";
import { getInitials } from "~/utils/user";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/shadcn";
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

export function Comment({
  comment,
  permissionMap,
}: {
  comment: IComment;
  permissionMap: PermissionMap;
}) {
  const [editComment, setEditComment] = React.useState(false);
  const [commentBody, setCommentBody] = React.useState(comment.raw);
  const [reply, setReply] = React.useState("");
  const [showReplyForm, setShowReplyForm] = React.useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const user = useOptionalUser();
  const navigate = useNavigate();

  const replyTake = Number(searchParams.get("replyTake")) || 3;

  const userId = user?.id;
  const author = comment?.author?.profile;

  const userPermission = permissionMap.get(comment.id);

  const isLiked = comment.likes?.some((like) => like.userId === user?.id);
  const totalLikes = comment?.likes?.reduce(
    (total, like) => total + like.count,
    0,
  );

  const canDelete =
    userPermission?.isOwner ||
    userPermission?.permissions.some((p) => p.action === "DELETE");
  const canUpdate =
    userPermission?.isOwner ||
    userPermission?.permissions.some((p) => p.action === "UPDATE");

  const {
    submit: submitReply,
    isPending: isCreating,
    submittedItemId: createdItemId,
  } = useCreate({
    itemId: comment.contentId,
    parentId: comment.id,
    userId: userId!,
    intent: "add-reply",
    body: reply,
  });
  const isCreatingReply = isCreating && createdItemId === comment.contentId;

  const {
    submit: deleteComment,
    isPending: isDeleting,
    submittedItemId: deletedItemId,
  } = useDelete({
    itemId: comment.id,
    intent: "delete-comment",
    userId: userId!,
  });
  const isDeletingComment = isDeleting && deletedItemId === comment.id;

  const {
    submit: upvoteComment,
    isPending: isUpvoting,
    submittedItemId: upvotedItemId,
  } = useUpvote({
    itemId: comment.id,
    intent: "upvote-comment",
    userId: userId!,
  });
  const isUpvotingComment = isUpvoting && upvotedItemId === comment.id;

  const {
    submit: updateComment,
    isPending: isUpdating,
    submittedItemId: updatedItemId,
  } = useUpdate({
    itemId: comment.id,
    userId: userId!,
    body: commentBody,
    intent: "update-comment",
  });
  const isUpdatingComment = isUpdating && updatedItemId === comment.id;

  function requireAuth(fn: (...args: unknown[]) => void) {
    return (...args: unknown[]) => (user ? fn(...args) : navigate("/signin"));
  }

  const handleReplySubmit = () => {
    if (!reply.trim()) return;
    submitReply();
    setShowReplyForm(false);
    setReply("");
  };

  const handleUpdateSubmit = () => {
    if (!commentBody.trim()) return;
    updateComment();
    setEditComment(false);
  };

  const handleLoadMoreReplies = () => {
    setSearchParams(
      (prev) => {
        prev.set("replyTake", String(replyTake + 3));
        return prev;
      },
      { preventScrollReset: true },
    );
  };

  const basicButtonClasses =
    "flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
  return (
    <li className="border-b border-gray-200 pb-6 last:border-0 dark:border-gray-800">
      <div className="flex items-start space-x-2">
        <Avatar className="-mt-0.5">
          {author?.image ? (
            <AvatarImage src={author.image} alt={author!.name!} />
          ) : null}
          <AvatarFallback>{getInitials(author!.name!)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="font-medium">{author!.name}</h4>
            <div className="flex gap-2 text-sm">
              {comment.replies?.length ? (
                <Badge>
                  {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "reply" : "replies"}
                </Badge>
              ) : null}
              <span className="text-gray-500 dark:text-gray-400">
                {formatDistanceToNowStrict(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          {editComment ? (
            <CommentForm
              isForUpdate
              comment={commentBody}
              setComment={setCommentBody}
              onSubmit={handleUpdateSubmit}
              onCancel={() => setEditComment(false)}
            />
          ) : (
            <Markdown source={comment.body} className="py-0 text-sm" />
          )}
          <div className="mt-2 flex items-center space-x-4">
            <button
              className={basicButtonClasses}
              onClick={requireAuth(upvoteComment)}
            >
              <Heart
                className={cn("size-4", {
                  "fill-red-500 text-red-500": isLiked,
                  "animate-bounce": isUpvotingComment,
                })}
              />
              <span>{totalLikes}</span>
            </button>
            <button
              onClick={requireAuth(() => setShowReplyForm(!showReplyForm))}
              className={basicButtonClasses}
              aria-label={
                isCreatingReply ? "replying comment" : "reply comment"
              }
            >
              {isCreatingReply ? (
                <Loader className="mr-1 size-4 animate-spin" />
              ) : (
                <MessageSquareQuote className="mr-1 size-4" />
              )}
              Reply
            </button>
            {canUpdate ? (
              <button
                onClick={() => setEditComment(true)}
                className={basicButtonClasses}
                aria-label={
                  isUpdatingComment ? "updating comment" : "update comment"
                }
              >
                {isUpdatingComment ? (
                  <Loader className="mr-1 size-4 animate-spin" />
                ) : (
                  <FilePenLine className="mr-1 size-4 text-blue-600 dark:text-blue-500" />
                )}
                Edit
              </button>
            ) : null}
            {canDelete ? (
              <AlertDialog>
                <AlertDialogTrigger
                  disabled={isDeletingComment}
                  className={basicButtonClasses}
                >
                  {isDeletingComment ? (
                    <Loader className="mr-1 size-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1 size-4 text-red-600 dark:text-red-500" />
                  )}{" "}
                  Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this comment?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteComment}>
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
          {comment.replies?.length ? <Separator className="mb-6 mt-4" /> : null}
          {showReplyForm ? (
            <CommentForm
              comment={reply}
              setComment={setReply}
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
            />
          ) : null}

          {/* Comment replies */}
          {comment.replies?.length ? (
            <ul className="mt-4 space-y-4 pl-6 dark:border-gray-800">
              {comment.replies.map((reply, index) => (
                <div key={reply.id}>
                  <Reply reply={reply} permissionMap={permissionMap} />
                  {index < comment.replies!.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
              {comment.replies.length >= replyTake && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={handleLoadMoreReplies}
                >
                  <ChevronDown className="mr-2 size-4" />
                  Load More Replies
                </Button>
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}
