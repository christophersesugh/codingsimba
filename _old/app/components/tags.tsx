import React from "react";
import { useSubmit } from "@remix-run/react";
import { Button } from "./button";

function TagsC({ tags }: { tags: string[] | undefined }) {
  const submit = useSubmit();

  return (
    <div>
      <h2 className="font-bold mb-4">Search blog by topics:</h2>
      <div className="flex flex-wrap mb-4 gap-4">
        {tags ? (
          tags?.map((tag: string | undefined, index: number) => (
            <Button
              value={tag}
              name="tag"
              onClick={() => {
                submit({ tag: tag || null }, { preventScrollReset: true });
              }}
              key={`${tag}-${index}`}
              className="bg-zinc-500 p-2 !rounded-3xl text-white hover:border-2 focus:border-2 border-blue-500 duration-200"
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
