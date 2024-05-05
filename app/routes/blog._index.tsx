import React from "react";
import { motion } from "framer-motion";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useSearchParams } from "@remix-run/react";
import { BlogCard } from "~/components/blog-card";
import { Tags } from "~/components/tags";
import { EmptyContentUI } from "~/components/empty-content-ui";
import { metaFn } from "~/utils/meta";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { getPosts, getTags } from "~/utils/blog.server";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { textVariants } from "~/animation-config";

export const meta: MetaFunction = metaFn;

export async function loader({ request }: LoaderFunctionArgs) {
  const tags = await getTags();
  const posts = await getPosts(request);
  const searchParams = new URL(request.url).searchParams;
  const q = searchParams.get("q");
  return json(
    { posts, tags, q },
    { headers: { "Cache-Control": "max-age=604800, must-revalidate, public" } }
  );
}

type PostProps = {
  data: { [key: string]: string };
  content: string;
};

function Blog() {
  const { posts, tags, q } = useLoaderData<typeof loader>();
  const [search, setSearch] = React.useState(q ?? "");
  const [postLimit, setPostLimit] = React.useState(6);
  const [, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setSearchParamsValue(name, value);
    setSearch(value);
  }

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { name, value } = event.currentTarget;
    setSearchParamsValue(name, value);
    setSearch(value);
  }

  function setSearchParamsValue(name: string, value: string) {
    if (value !== "" || value !== null) {
      setSearchParams({ [name]: value }, { preventScrollReset: true });
    }
  }

  const increasePostLimit = React.useCallback(() => {
    setPostLimit((prevLimit) => {
      const newLimit = prevLimit + 6;
      return newLimit;
    });
    submit({ postLimit }, { preventScrollReset: true });
  }, [postLimit, submit]);

  return (
    <Container className="!max-w-4xl mx-auto flex flex-col justify-center my-20">
      <motion.h1
        variants={textVariants}
        className="mb-12 text-3xl font-bol max-w-md"
      >
        Exploring the World of Development:
        <span className="text-slate-400"> Dive into My Latest Articles</span>
      </motion.h1>
      <div className="mb-16 flex flex-col gap-12">
        {/* search input */}
        <motion.div variants={textVariants}>
          <motion.div variants={textVariants}>
            <Label htmlFor="search" className="text-lg">
              Search the blog:
            </Label>
          </motion.div>
          <Input
            type="search"
            name="q"
            id="q"
            value={search}
            placeholder="search blog"
            onChange={handleFormChange}
            className="bg-slate-300 text-lg text-black md:w-[50%] p-8 rounded-xl"
          />
        </motion.div>
        {/* post tags */}
        <Tags tags={tags} q={q} handleClick={handleButtonClick} />
      </div>

      <div>
        {!posts?.length ? (
          <EmptyContentUI message="no posts found with given query." />
        ) : null}
      </div>

      {/* success UI */}
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 justify-evenly mb-12 mt-8">
        {posts && posts?.length
          ? posts.map((post: PostProps, index: number) => (
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
