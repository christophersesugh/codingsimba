import React from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { readingTime } from "reading-time-estimator";
import { textVariants } from "~/animation-config";

type PostProps = {
  data: { [key: string]: string };
  content: string;
};

function Card({ post }: { post: PostProps }) {
  const { data, content } = post;
  const { text } = readingTime(content);

  function prefetchImage() {
    const image = new Image();
    image.src = data.thumbnail;
  }
  return (
    <Link
      prefetch="intent"
      onMouseEnter={prefetchImage}
      onFocus={prefetchImage}
      to={`/blog/${data.slug}`}
    >
      <motion.article
        variants={textVariants}
        className="flex flex-col gap-2 drop-shadow-xl max-w-[20rem] mx-auto"
      >
        <div className="min-h-full h-full w-full rounded-md p-1 hover:border-4 duration-300 hover:border-blue-500">
          <img
            src={data.thumbnail}
            alt={data.title}
            // height={350}
            // width={500}
            className="rounded-md min-w-full min-h-[300px] h-[300px] object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 p-2">
          <p className="text-slate-500 text-lg dark:text-slate-400">
            {moment(data.createdAt).format("MMM DD, YYYY")} ~ {text}
          </p>

          <div className="flex flex-wrap gap-2">
            {data.tags.split(",").map((tag: string, index: number) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-xl bg-stone-500 p-1 text-xs text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h1 className="text-lg p-2 capitalize my-auto">{data.title}</h1>
      </motion.article>
    </Link>
  );
}

export const BlogCard = React.memo(Card);
