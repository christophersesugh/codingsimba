import React from "react";
import { formatDistanceToNow } from "date-fns";
import type { IComment } from ".";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FilePenLine, Heart, MessageSquareQuote, Trash2 } from "lucide-react";
import { Reply } from "./reply";
import { CommentForm } from "./comment-form";
import { Markdown } from "../mdx";
// import { useFetcher } from "react-router";
import { useAuthDialog } from "~/contexts/auth-dialog";
import { useOptionalUser } from "~/hooks/user";
// import { toast } from "sonner";

export function Comment({ comment }: { comment: IComment }) {
  const [reply, setReply] = React.useState("");
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  // const fetcher = useFetcher({ key: "article-comment-reply" });
  const user = useOptionalUser();
  const { openDialog } = useAuthDialog();

  const author = comment!.author!.profile;

  // const handleCommentReply = React.useCallback(() => {
  //   fetcher
  //     .submit(
  //       {
  //         comment: reply,
  //         articleId: comment.contentId,
  //         parentId: comment.id,
  //         authorId: user!.id,
  //         intent: "reply-comment",
  //       },
  //       { method: "post" },
  //     )
  //     .then(() => {
  //       toast("Reply posted");
  //     });
  // }, [comment.contentId, comment.id, fetcher, reply, user]);

  function handleCommentDelete() {}
  // function handleCommentEdit(commentId: string, content: string) {}
  function handleCommentLike() {}

  const basicButtonClasses =
    "flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
  return (
    <li className="border-b border-gray-200 pb-6 last:border-0 dark:border-gray-800">
      <div className="flex items-start space-x-2">
        <Avatar className="-mt-0.5">
          {author?.image ? (
            <AvatarImage src={author.image} alt={author!.name as string} />
          ) : null}
          <AvatarFallback>{author!.name!.charAt(0)}</AvatarFallback>
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
          <Markdown source={comment.body} className="py-0" />
          <div className="mt-2 flex items-center space-x-4">
            <button
              className={basicButtonClasses}
              onClick={() => (user ? handleCommentLike() : openDialog())}
            >
              <Heart className="size-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() =>
                user ? setShowReplyForm(!showReplyForm) : openDialog()
              }
              className={basicButtonClasses}
            >
              <MessageSquareQuote className="mr-1 size-4" />
              reply
            </button>
            {user ? (
              <button
                // onClick={() => handleCommentEdit(comment.id)}
                className={basicButtonClasses}
              >
                <FilePenLine className="mr-1 size-4 text-blue-600 dark:text-blue-500" />
                edit
              </button>
            ) : null}
            {user ? (
              <button
                onClick={() => handleCommentDelete()}
                className={basicButtonClasses}
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
              // handleFormSubmit={handleCommentReply}
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
