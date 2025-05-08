import React from "react";
import { formatDistanceToNow } from "date-fns";
import type { IComment } from ".";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FilePenLine, Heart, MessageSquareQuote, Trash2 } from "lucide-react";
import { Reply } from "./reply";
import { CommentForm } from "./comment-form";
import { Markdown } from "../mdx";
import { useAuthDialog } from "~/contexts/auth-dialog";
import { useOptionalUser } from "~/hooks/user";
import {
  useContentUpvote,
  useDeleteComment,
  useSubmitComment,
  useUpdateComment,
} from "~/hooks/content";
import { getInitials } from "~/utils/user";

export function Comment({ comment }: { comment: IComment }) {
  const [editComment, setEditComment] = React.useState(false);
  const [commentBody, setCommentBody] = React.useState(comment.raw);
  const [reply, setReply] = React.useState("");
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const { openDialog } = useAuthDialog();
  const user = useOptionalUser();

  const userId = user?.id;
  const author = comment!.author!.profile;

  const { submit: submitReply } = useSubmitComment({
    itemId: null,
    parentId: comment.id,
    userId: userId!,
    intent: "add-reply",
    content: reply,
  });

  const { submit: deleteComment } = useDeleteComment({
    itemId: comment.id,
    userId: userId!,
    intent: "delete-comment",
  });

  const { submit: upvoteComment } = useContentUpvote({
    itemId: comment.id,
    userId: userId!,
    intent: "upvote-comment",
  });

  const { submit: updateComment } = useUpdateComment({
    itemId: comment.id,
    userId: userId!,
    content: "",
    intent: "update-comment",
  });

  const basicButtonClasses =
    "flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
  return (
    <li className="border-b border-gray-200 pb-6 last:border-0 dark:border-gray-800">
      <div className="flex items-start space-x-2">
        <Avatar className="-mt-0.5">
          {author?.image ? (
            <AvatarImage src={author.image} alt={author!.name as string} />
          ) : null}
          <AvatarFallback>{getInitials(author!.name!)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="font-medium">{author!.name}</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </span>
          </div>
          {editComment ? (
            <CommentForm
              isForUpdate
              comment={commentBody}
              setComment={setCommentBody}
              handleFormSubmit={() => {
                updateComment();
                setEditComment(false);
              }}
            />
          ) : (
            <Markdown source={comment.body} className="py-0" />
          )}
          <div className="mt-2 flex items-center space-x-4">
            <button
              className={basicButtonClasses}
              onClick={() => (user ? upvoteComment() : openDialog())}
            >
              <Heart className="size-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() =>
                user ? setShowReplyForm(!showReplyForm) : openDialog()
              }
              className={basicButtonClasses}
              aria-label="reply comment"
            >
              <MessageSquareQuote className="mr-1 size-4" />
              reply
            </button>
            {user ? (
              <button
                onClick={() => setEditComment(true)}
                className={basicButtonClasses}
                aria-label="update comment"
              >
                <FilePenLine className="mr-1 size-4 text-blue-600 dark:text-blue-500" />
                edit
              </button>
            ) : null}
            {user ? (
              <button
                onClick={deleteComment}
                className={basicButtonClasses}
                aria-label="delete commment"
              >
                <Trash2 className="mr-1 size-4 text-red-600 dark:text-red-500" />
                delete
              </button>
            ) : null}
          </div>
          <Separator className="mb-6 mt-4" />

          {showReplyForm ? (
            <CommentForm
              comment={reply}
              setComment={setReply}
              handleFormSubmit={submitReply}
            />
          ) : null}

          {/* Comment replies */}
          {comment.replies?.length ? (
            <ul className="mt-4 space-y-4 pl-6 dark:border-gray-800">
              {comment.replies.map((reply, i) => (
                <div key={reply.id}>
                  <Reply reply={reply} />
                  {i <= (comment?.replies?.length ?? 0) - 1 ? (
                    <Separator className="my-4" />
                  ) : null}
                </div>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}
