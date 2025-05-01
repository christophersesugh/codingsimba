import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Send } from "lucide-react";
// import { MDXEditor } from "../mdx/editor.client";
import { Button } from "../ui/button";

type CommentFormProps = {
  comment: string;
  setComment: (comment: string) => void;
  // handleFormSubmit: () => Promise<void> | void;
};

export function CommentForm({
  comment,
  // setComment,
  // handleFormSubmit,
}: CommentFormProps) {
  const hideSubmitButton = !comment.trim() || comment.trim() === "<br />";

  return (
    <div className="mb-2">
      <div className="flex w-full flex-1 flex-col items-start space-x-4 md:flex-row">
        <Avatar className="flex items-center justify-center border border-gray-300 dark:border-gray-600">
          <AvatarImage
            src="/placeholder.svg?height=40&width=40&text=You"
            alt="Your avatar"
          />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-1 flex-col">
          {/* <MDXEditor setValue={setComment} value={comment} /> */}
          {hideSubmitButton ? null : (
            <Button
              type="submit"
              size={"sm"}
              disabled={hideSubmitButton}
              // onClick={handleFormSubmit}
              className="mt-2 flex items-center gap-2 self-end"
            >
              <Send /> Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
