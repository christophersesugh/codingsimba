import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FilePenLine, Heart, Trash2 } from "lucide-react";
import { cn } from "~/lib/shadcn";
import type { IComment } from ".";
import { formatDistanceToNow } from "date-fns";
import { Markdown } from "../mdx";
import { getInitials } from "~/utils/user";

export function Reply({ reply }: { reply: IComment }) {
  const author = reply?.author?.profile;

  const basicButtonClasses =
    "space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
  return (
    <li className="flex items-start space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={author?.image ?? ""} alt={author?.name ?? ""} />
        <AvatarFallback>{getInitials(author!.name!)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h5 className="text-sm font-medium">{author!.name}</h5>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
        </div>
        {/* <p className="mb-1 text-sm text-gray-700 dark:text-gray-300"> */}
        <Markdown source={reply.body} className="py-1 !text-sm" />
        {/* </p> */}
        <div className="mt-2 flex items-center gap-4">
          <button className={cn(basicButtonClasses, "flex items-center")}>
            <Heart className="size-4 fill-red-500" />
            <span>{reply.likes}</span>
          </button>
          <button className={basicButtonClasses}>
            <FilePenLine className="size-4 text-blue-600 dark:text-blue-500" />
          </button>
          <button className={basicButtonClasses}>
            <Trash2 className="size-4 text-red-600 dark:text-red-500" />
          </button>
        </div>
      </div>
    </li>
  );
}
