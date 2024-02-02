/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BlogCard } from "~/components/blog-card";
import { ContentContainer } from "~/components/content-container";
import { EmptyContentUI } from "~/components/empty-content-ui";
import { getPost, getRelatedPosts } from "~/utils/blog.server";
import { metaFn } from "~/utils/meta";

export const meta = metaFn;

export async function loader(request: LoaderFunctionArgs) {
  const post = await getPost(request.params.slug);
  const relatedPosts = await getRelatedPosts(post.data.tags, post.data.slug);
  return json({ relatedPosts, post }, 200);
}

export default function BlogPostRoute() {
  const { relatedPosts, post } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-3xl md:px-0 mx-auto">
      {post ? (
        <ContentContainer to="/blog" text="back to overview" post={post} />
      ) : !post ? (
        <EmptyContentUI message="no post found with given slug." />
      ) : null}

      <hr />
      <div className="flex flex-col gap-6 mt-6">
        <h2 className="text-2xl font-bold px-4">Related articles:</h2>
        {relatedPosts?.length ? (
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-20 justify-between mb-12">
            {relatedPosts.map((post: any, index: number) => (
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
    </div>
  );
}
