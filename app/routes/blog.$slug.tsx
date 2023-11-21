import React from "react";
import type { DataFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "invariant";
import { response } from "~/utils/response.server";
import { getPost, getRelatedPosts } from "~/model/post.server";
import { BlogCard } from "~/components/blog-card";
import { ContentContainer } from "~/components/content-container";
import { EmptyContentUI } from "~/components/empty-content-ui";
// import { mdxBundle } from "~/utils/bundler.server";
import { metaFn } from "~/utils/meta";

export const meta = metaFn;

export async function loader(request: LoaderFunctionArgs) {
  const { params } = request as DataFunctionArgs;
  invariant(params.slug, "Missing post slug");
  try {
    const post = await getPost(params.slug);
    // const { data, code } = await mdxBundle({ source: post });
    const relatedPosts = await getRelatedPosts(post.data.tags, post.data.slug);
    return json(response({ data: { relatedPosts, post } }), 200);
  } catch (error) {
    throw error;
  }
}

export default function BlogPostRoute() {
  const { data, ok } = useLoaderData<typeof loader>();
  const { post, relatedPosts } = data as any;

  return (
    <div className="max-w-3xl md:px-0 mx-auto">
      {post && ok ? (
        <ContentContainer to="/blog" text="back to overview" {...post} />
      ) : !post && ok ? (
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
