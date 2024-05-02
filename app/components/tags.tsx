import React from "react";
import { cn } from "~/utils/shadcn";
import { Button } from "./ui/button";

type TagsProps = {
  tags: string[];
  q: string | null;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function TagsC({ tags, q, handleClick }: TagsProps) {
  return (
    <div>
      <h2 className="font-bold mb-4">Search blog by topics:</h2>
      <div className="flex flex-wrap mb-4 gap-4">
        {tags ? (
          tags?.map((tag: string | undefined, index: number) => (
            <Button
              value={tag}
              name="q"
              onClick={handleClick}
              key={`${tag}-${index}`}
              className={cn(
                "bg-zinc-500 px-4 py-2 rounded-xl text-white hover:border-2 focus:border-3 border-4 border-blue-500 duration-300",
                {
                  "opacity-70 border-0": !q?.includes(tag ?? ""),
                }
              )}
            >
              {tag}
            </Button>
          ))
        ) : (
          <p className="text-slate-400">No post tags.</p>
        )}
      </div>
    </div>
  );
}

export const Tags = React.memo(TagsC);
