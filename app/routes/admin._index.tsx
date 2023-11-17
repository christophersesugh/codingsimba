import React from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { SubmitOptions } from "@remix-run/react";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { FaSpinner } from "react-icons/fa";
import {
  MdUnpublished,
  MdDelete,
  MdEditDocument,
  MdPublishedWithChanges,
} from "react-icons/md";
import { deletePost, getPosts, getTags } from "~/model/post.server";
import { Button } from "~/components/button";
import { FormInput } from "~/components/form-input";
import { Section } from "~/components/section";
import { Tags } from "~/components/tags";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const tags = await getTags();
    const posts = await getPosts(request);
    return json({ posts, tags });
  } catch (error) {
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const postDelete = formData.get("delete");
  try {
    if (postDelete) {
      console.log("deleting");
      console.log(postDelete);
      const response = await deletePost(postDelete);
      return json({ data: { response }, ok: true });
    }
    return json({ ok: false });
  } catch (error) {
    throw error;
  }
}

export default function AdminIndexRoute() {
  const [postLimit, setPostLimit] = React.useState(2);
  const { posts, tags } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";

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
    <Section>
      <div className="flex justify-evenly flex-wrap items-center mb-8">
        <Form method="POST" action="/logout">
          <Button
            type="submit"
            className="border-2 border-red-500 rounded-md capitalize"
          >
            log out
          </Button>
        </Form>
        <Link to="create-post" className="border-2 rounded-md capitalize">
          <Button>add post</Button>
        </Link>
      </div>
      <div className="mb-16 flex flex-col gap-8">
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
        <Button
          onClick={increasePostLimit}
          className="border-2  mx-auto rounded-md p-4 capitalize border-slate-400"
        >
          load more posts
        </Button>
      </div>

      <ul className="space-y-4">
        {posts?.length
          ? posts.map((post) => (
              <li
                key={post.frontmatter.slug}
                className="flex flex-wrap list-disc list-outside items-center justify-between border-b-2"
              >
                <Button type="button">
                  {post.frontmatter.published ? (
                    <MdPublishedWithChanges className="text-green-500" />
                  ) : (
                    <MdUnpublished className="text-yellow-500" />
                  )}
                </Button>
                <Link to={`/blog/${post.frontmatter.slug}`}>
                  <h1 className="self-start capitalize text-blue-500">
                    {post.frontmatter.title}
                  </h1>
                </Link>
                <div className="flex gap-4">
                  <Link to={`/admin/edit/${post.frontmatter.slug}`}>
                    <Button>
                      {isLoading || isSubmitting ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <MdEditDocument className="text-blue-500" />
                      )}
                    </Button>
                  </Link>
                  <fetcher.Form method="POST" action="/admin?index">
                    <Button
                      type="submit"
                      name="delete"
                      value={post.frontmatter.slug}
                    >
                      {isLoading || isSubmitting ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <MdDelete className="text-red-500" />
                      )}
                    </Button>
                  </fetcher.Form>
                </div>
              </li>
            ))
          : null}
      </ul>
    </Section>
  );
}
