import React from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { BlogCard } from "~/components/blog-card";
import { Tags } from "~/components/tags";
import { EmptyContentUI } from "~/components/empty-content-ui";
import { metaFn } from "~/utils/meta";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { getPosts, getTags } from "~/utils/blog.server";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const meta: MetaFunction = metaFn;

export async function loader({ request }: LoaderFunctionArgs) {
  const tags = await getTags();
  const posts = await getPosts(request);
  return json({ posts, tags });
}

type SubmitOptions = {
  method: "GET" | "POST";
  preventScrollReset: boolean;
};

function Blog() {
  const [postLimit, setPostLimit] = React.useState(6);
  const { posts, tags } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const submitOptions: SubmitOptions = React.useMemo(
    () => ({
      method: "GET",
      preventScrollReset: true,
    }),
    [],
  );

  function handleFormChange(event: {
    target: { name: string; value: string };
  }) {
    const { name, value } = event.target;
    submit({ [name]: value }, submitOptions);
  }

  const increasePostLimit = React.useCallback(() => {
    setPostLimit((prevLimit) => {
      const newLimit = prevLimit + 6;
      return newLimit; // Return the new postLimit to update the state
    });
    submit({ postLimit }, submitOptions);
  }, [postLimit, submit, submitOptions]);

  return (
    <Container className="!max-w-4xl flex flex-col justify-center my-20">
      <h1 className="mb-12 text-3xl font-bol max-w-md">
        Exploring the World of Development:
        <span className="text-slate-400"> Dive into My Latest Articles</span>
      </h1>
      <div className="mb-16 flex flex-col gap-12">
        {/* search input */}
        <div>
          <Label htmlFor="search" className="text-lg">
            Search the blog:
          </Label>
          <Input
            type="search"
            name="search"
            id="search"
            placeholder="search posts"
            onChange={handleFormChange}
            className="bg-slate-300 text-black md:w-[50%]"
          />
        </div>
        {/* post tags */}
        <Tags tags={tags} />
      </div>

      <div>
        {/* no posts UI */}
        {!posts?.length ? (
          <EmptyContentUI message="no posts found with given query." />
        ) : null}
      </div>

      {/* success UI */}
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 justify-evenly my-12">
        {posts && posts?.length
          ? posts.map((post: any, index: number) => (
              <BlogCard post={post} key={`${post.data.slug}-${index}`} />
            ))
          : null}
      </div>

      {/* load more posts button */}
      <Button
        variant="outline"
        onClick={increasePostLimit}
        className="border-2  mx-auto rounded-md p-4 capitalize"
      >
        load more posts
      </Button>
    </Container>
  );
}

export default React.memo(Blog);
