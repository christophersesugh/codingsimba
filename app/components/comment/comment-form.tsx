import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Send, X } from "lucide-react";
import { MDXEditor } from "../mdx/editor";
import { Button } from "../ui/button";

type CommentFormProps = {
  isForUpdate?: boolean;
  comment: string;
  setComment: (comment: string) => void;
  handleFormSubmit: () => Promise<void> | void;
};

export function CommentForm({
  isForUpdate = false,
  comment,
  setComment,
  handleFormSubmit,
}: CommentFormProps) {
  const hideSubmitButton = !comment.trim() || comment.trim() === "<br />";

  return (
    <div className="mb-2">
      <div className="flex w-full flex-1 flex-col items-start space-x-4 md:flex-row">
        {!isForUpdate ? (
          <Avatar className="flex items-center justify-center border border-gray-300 dark:border-gray-600">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40&text=You"
              alt="Your avatar"
            />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
        ) : null}
        <div className="flex w-full flex-1 flex-col">
          <MDXEditor setValue={setComment} value={comment} />
          {hideSubmitButton ? null : (
            <div className="mt-2 flex justify-end">
              {isForUpdate ? (
                <Button
                  size={"sm"}
                  // onClick={handleFormSubmit}
                  className="mr-4 flex items-center gap-2"
                  variant={"destructive"}
                >
                  <X /> Cancel
                </Button>
              ) : null}
              <Button
                type="submit"
                size={"sm"}
                disabled={hideSubmitButton}
                onClick={handleFormSubmit}
                className="flex items-center gap-2"
              >
                <Send /> Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
