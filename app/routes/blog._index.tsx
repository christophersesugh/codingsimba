import React from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { response } from "~/utils/response.server";
import { getPosts, getTags } from "~/model/post.server";
import { Section } from "~/components/section";
import { BlogCard } from "~/components/blog-card";
import { Button } from "~/components/button";
import { FormInput } from "~/components/form-input";
import { Tags } from "~/components/tags";
import { EmptyContentUI } from "~/components/empty-content-ui";
import { ContentErrorUI } from "~/components/content-error-ui";
import { metaFn } from "~/utils/meta";

export const meta: MetaFunction = metaFn;

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const tags = await getTags();
    const posts = await getPosts(request);
    return json(response({ data: { posts, tags } }));
  } catch (error) {
    throw error;
  }
}

type SubmitOptions = {
  method: "GET" | "POST";
  preventScrollReset: boolean;
};

type POST = {
  data: {
    slug: string;
  };
};

function Blog() {
  const [postLimit, setPostLimit] = React.useState(6);
  const { data, error, ok } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const submitOptions: SubmitOptions = React.useMemo(
    () => ({
      method: "GET",
      preventScrollReset: true,
    }),
    [],
  );

  const { posts, tags } = data as any;

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
    <Section className="!max-w-4xl flex flex-col justify-center my-20">
      <h1 className="mb-12 text-3xl font-bol max-w-md">
        Exploring the World of Development:
        <span className="text-slate-400"> Dive into My Latest Articles</span>
      </h1>
      <div className="mb-16 flex flex-col gap-12">
        {/* search input */}
        <FormInput
          type="search"
          name="search"
          id="search"
          label="Search the blog:"
          placeholder="search posts"
          onChange={handleFormChange}
          className="p-4 bg-slate-300 text-black md:w-[50%]"
        />
        {/* post tags */}
        <Tags tags={tags} />
      </div>

      <div>
        {/* no posts UI */}
        {!posts?.length && ok ? (
          <EmptyContentUI message="no posts found with given query." />
        ) : null}
        {/* error UI */}
        {!ok ? <ContentErrorUI error={error} /> : null}
      </div>

      {/* success UI */}
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 justify-evenly my-12">
        {posts && ok && posts?.length
          ? posts.map((post: POST, index: number) => (
              <BlogCard post={post} key={`${post.data.slug}-${index}`} />
            ))
          : null}
      </div>

      {/* load more posts button */}
      <Button
        onClick={increasePostLimit}
        className="border-2  mx-auto rounded-md p-4 capitalize border-slate-400"
      >
        load more posts
      </Button>
    </Section>
  );
}

export default React.memo(Blog);
