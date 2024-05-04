import React from "react";
import { motion } from "framer-motion";
import { cn } from "~/utils/shadcn";
import { Button } from "./ui/button";
import { containerVariants, textVariants } from "~/animation-config";

type TagsProps = {
  tags: string[];
  q: string | null;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function TagsC({ tags, q, handleClick }: TagsProps) {
  return (
    <motion.div variants={containerVariants}>
      <motion.h2 variants={textVariants} className="font-bold mb-4">
        Search blog by topics:
      </motion.h2>
      <motion.div
        variants={containerVariants}
        className="flex flex-wrap mb-4 gap-4"
      >
        {tags ? (
          tags?.map((tag: string | undefined, index: number) => (
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              key={index}
              // className="w-full"
            >
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
            </motion.div>
          ))
        ) : (
          <p className="text-slate-400">No post tags.</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export const Tags = React.memo(TagsC);
