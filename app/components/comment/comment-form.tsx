import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Send, X } from "lucide-react";
import { MDXEditor } from "../mdx/editor";
import { Button } from "../ui/button";
import { useOptionalUser } from "~/hooks/user";
import { getInitials } from "~/utils/user";

type CommentFormProps = {
  isForUpdate?: boolean;
  comment: string;
  setComment: (comment: string) => void;
  hideForm?: () => void;
  handleFormSubmit: () => void;
  isPending?: boolean;
};

export function CommentForm({
  isForUpdate = false,
  comment,
  setComment,
  hideForm,
  handleFormSubmit,
  isPending = false,
}: CommentFormProps) {
  const hideSubmitButton = !comment.trim() || comment.trim() === "<br />";
  const user = useOptionalUser();
  const profile = user?.profile;

  const onSubmit = () => {
    if (hideSubmitButton) return;
    handleFormSubmit();
  };

  return (
    <div className="mb-4 mt-2">
      <div className="flex w-full flex-1 flex-col items-start space-x-4 md:flex-row">
        {!isForUpdate ? (
          <Avatar className="flex items-center justify-center border border-gray-300 dark:border-gray-600">
            {profile?.image ? (
              <AvatarImage src={profile.image} alt={profile.name!} />
            ) : null}
            <AvatarFallback>{getInitials(profile!.name!)}</AvatarFallback>
          </Avatar>
        ) : null}
        <div className="flex w-full max-w-full flex-1 flex-col">
          <MDXEditor setValue={setComment} value={comment} />
          {!hideSubmitButton ? (
            <div className="mt-2 flex justify-end">
              {isForUpdate ? (
                <Button
                  size={"icon"}
                  onClick={hideForm}
                  className="mr-4 flex items-center gap-2"
                  variant={"destructive"}
                >
                  <X />
                </Button>
              ) : null}
              <Button
                type="submit"
                size={"icon"}
                disabled={hideSubmitButton || isPending}
                onClick={onSubmit}
                className="flex items-center gap-2"
              >
                <Send />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
