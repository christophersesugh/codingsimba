import React from "react";
import { Link } from "@remix-run/react";
import moment from "moment";
import readingTime from "reading-time";

function Card({ post }: any) {
  const { frontmatter, code } = post;
  const stats = readingTime(code);
  return (
    <Link to={`/blog/${frontmatter.slug}`}>
      <article className="flex flex-col gap-2 drop-shadow-xl max-w-[20rem] mx-auto">
        <div className="min-h-[50%] w-full rounded-md p-1 hover:border-4 duration-300 hover:border-blue-500">
          <img
            src={frontmatter.photo}
            alt={frontmatter.title}
            className="w-full min-h-full rounded-md object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 p-2">
          <p className="text-slate-500 text-lg dark:text-slate-400">
            {moment(frontmatter.createdAt).format("MMM DD, YYYY")} --{" "}
            {stats.text}
          </p>

          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.split(",").map((tag: string, index: number) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-xl bg-stone-500 p-1 text-xs text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h1 className="text-lg p-2 capitalize my-auto">{frontmatter.title}</h1>
      </article>
    </Link>
  );
}

export const BlogCard = React.memo(Card);
