import React from "react";
import { MessageSquareOff } from "lucide-react";
import { EmptyState } from "../empty-state";
import { CommentForm } from "./comment-form";
import { Comment } from "./comment";
// import { useFetcher } from "react-router";
// import { toast } from "sonner";
import { useOptionalUser } from "~/hooks/user";
import { useAuthDialog } from "~/contexts/auth-dialog";
import { Badge } from "../ui/badge";
// import { MDXEditor } from "../mdx/editor";

interface ICommentAuthorProfile {
  name: string | null;
  image: string | null;
}

interface ICommentAuthor {
  id: string;
  profile: ICommentAuthorProfile | null;
}

export interface IComment {
  id: string;
  body: string;
  likes: number;
  createdAt: Date;
  parentId: string | null;
  authorId: string | null;
  contentId: string;
  author: ICommentAuthor | null;
  replies?: IComment[];
}

export function Comments({
  comments,
  // articleId,
}: {
  comments: IComment[];
  articleId: string;
}) {
  const [comment, setComment] = React.useState("");
  const user = useOptionalUser();
  // const fetcher = useFetcher({ key: "article-comment" });
  const { openDialog } = useAuthDialog();

  // function handleCommentSubmit({
  //   content,
  //   articleId,
  //   parentId,
  //   authorId,
  //   intent,
  //   toastMessage,
  // }: {
  //   content: string;
  //   articleId: string;
  //   parentId: string | null;
  //   authorId: string;
  //   intent: "submit-comment" | "reply-comment";
  //   toastMessage: string;
  // }) {
  //   fetcher
  //     .submit({ content, articleId, parentId, authorId, intent } as const, {
  //       method: "post",
  //     })
  //     .then(() => {
  //       toast(toastMessage);
  //     });
  // }

  return (
    <section className="mb-8" id="comments">
      <h3 className="mb-4 text-xl font-bold">Comments ({comments.length})</h3>
      {user ? (
        <CommentForm
          comment={comment}
          setComment={setComment}
          // handleFormSubmit={handleCommentSubmit}
        />
      ) : (
        <Badge className="-mt-2 mb-4" onClick={() => openDialog()}>
          Signin to add a comment
        </Badge>
      )}

      {comments?.length ? (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<MessageSquareOff className="size-8" />}
          title="No comments yet"
          description="Be the first to share your thoughts on this article!"
          className="py-6"
        />
      )}
    </section>
  );
}
