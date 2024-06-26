/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { motion } from "framer-motion";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPost, getRelatedPosts } from "~/utils/blog.server";
import { useLoaderData } from "@remix-run/react";
import { readingTime } from "reading-time-estimator";
import { metaFn } from "~/utils/meta";
import { BackButton } from "~/components/back-button";
import { BlogCard } from "~/components/blog-card";
import { Container } from "~/components/container";
import { EmptyContentUI } from "~/components/empty-content-ui";
import { Iframe } from "~/components/iframe";
import { Markdown } from "~/components/mdx";
import { containerVariants, textVariants } from "~/animation-config";

type PostProps = {
  data: { [key: string]: string };
  content: string;
};

export const meta = metaFn;

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params);
  const relatedPosts = await getRelatedPosts(post);
  return json(
    { relatedPosts, post },
    { headers: { "Cache-Control": "max-age=604800, must-revalidate, public" } }
  );
}

export default function BlogPostRoute() {
  const { relatedPosts, post } = useLoaderData<typeof loader>();
  const { data, content } = post;
  const stats = readingTime(content);

  return (
    <Container className="max-w-3xl md:px-0">
      {post ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key="some-key"
        >
          <BackButton
            to="/blog"
            text="back to overview"
            className="pl-0 mb-4"
          />
          <div>
            <motion.h1
              variants={textVariants}
              className="text-3xl capitalize mb-4"
            >
              {data.title}
            </motion.h1>
            <motion.p
              variants={textVariants}
              className="text-slate-500 dark:text-slate-400 text-lg mb-6"
            >
              {moment(data.createdAt).format("MMM DD, YYYY")} ~ {stats.text}
            </motion.p>
          </div>
          <div className="w-full h-[250px] min-h-[250px] sm:h-[500px] sm:min-h-[500px]">
            {data.thumbnail ? (
              <img
                src={data.thumbnail}
                alt={data.title}
                title={data.title}
                // height={256}
                // width={512}
                className="h-full min-h-full w-full min-w-full rounded-md shadow-md"
              />
            ) : null}
          </div>
          <motion.div
            variants={textVariants}
            className="text-lg remark-container info border-slate-400 dark:bg-slate-600 bg-slate-200"
          >
            {data.description}
          </motion.div>

          {data?.videoId ? (
            <Iframe src={data.videoId} title={data.title} />
          ) : null}
          <motion.div
            variants={textVariants}
            className="dark:text-slate-300 text-slate-800 mb-6 markdown"
          >
            <Markdown source={content} />
          </motion.div>
        </motion.div>
      ) : (
        <EmptyContentUI message="no post found with given slug." />
      )}

      <hr />
      <div className="flex flex-col gap-6 mt-6">
        <h2 className="text-2xl font-bold px-4">Related articles:</h2>
        {relatedPosts?.length ? (
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-20 justify-between mb-12">
            {relatedPosts.map((post: PostProps, index: number) => (
              <BlogCard post={post} key={`${post.data.slug}-${index}`} />
            ))}
          </div>
        ) : (
          <EmptyContentUI
            message="no related posts for this post."
            className="!text-xl !-mt-4"
          />
        )}
      </div>
    </Container>
  );
}
