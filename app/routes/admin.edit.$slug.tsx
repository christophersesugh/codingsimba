import React from "react";
import invariant from "invariant";
import matter from "gray-matter";
import type {
  ActionFunctionArgs,
  DataFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import type { PostValueProps } from "~/components/blog-form";
import { json, redirect } from "@remix-run/node";
import { useNavigation, useActionData, useLoaderData } from "@remix-run/react";
import { getPost, updatePost } from "~/model/post.server";
import { response } from "~/utils/response.server";
import { Section } from "~/components/section";
import { BlogForm } from "~/components/blog-form";
import { useLocalStorageState } from "~/utils/hooks";
import { PageTitle } from "~/components/page-title";
import { BackButton } from "~/components/back-button";

export async function loader(request: LoaderFunctionArgs) {
  const { params } = request as DataFunctionArgs;
  invariant(params.slug, "Missing post slug");

  try {
    const post = await getPost(params.slug);
    const { data, content } = matter(post);
    return json(response({ data: { post: { data, content } } }), 200);
  } catch (error) {
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    await updatePost(formData);
    return redirect("/admin?index");
  } catch (error) {
    return json(response({ ok: false }), 500);
  }
}

export default function EditPostRoute() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const { data } = useLoaderData<typeof loader>();
  const { post } = data as any;
  const [values, setValues] = useLocalStorageState<PostValueProps>(
    "postValues",
    post as PostValueProps,
  );

  function handleFormInputChange(event: any) {
    const { name, value, type, checked } = event.target;
    setValues((initialValues) => ({
      ...initialValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  React.useEffect(() => {
    setValues(post);
  }, [post, setValues]);

  return (
    <Section className="!max-w-3xl my-12">
      <PageTitle title="edit post" />
      <BackButton to="/admin" text="dashboard" />
      <BlogForm
        actionType="edit post"
        formAction={`/admin/edit/${post.data.slug}`}
        values={values}
        setValues={setValues}
        actionData={actionData}
        navigation={navigation}
        handleFormInputChange={handleFormInputChange}
      />
    </Section>
  );
}
