import type { ActionFunctionArgs } from "@remix-run/node";
import type { PostValueProps } from "~/components/blog-form";
import { json, redirect } from "@remix-run/node";
import { useNavigation, useActionData } from "@remix-run/react";
import { createPost } from "~/model/post.server";
import { response } from "~/utils/response.server";
import { Section } from "~/components/section";
import { BlogForm } from "~/components/blog-form";
import { useLocalStorageState } from "~/utils/hooks";
import { PageTitle } from "~/components/page-title";
import { BackButton } from "~/components/back-button";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    await createPost(formData);
    return redirect("/admin?index");
  } catch (error) {
    return json(response({ ok: false }), 500);
  }
}

export default function CreatePostRoute() {
  const [values, setValues] = useLocalStorageState<PostValueProps>(
    "postValues",
    {} as PostValueProps,
  );

  function handleFormInputChange(event: any) {
    const { name, value, type, checked } = event.target;
    setValues((initialValues) => ({
      ...initialValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const navigation = useNavigation();
  const actionData = useActionData();
  return (
    <Section className="!max-w-3xl my-12">
      <PageTitle title="add post" />
      <BackButton to="/admin" text="dashboard" />
      <BlogForm
        actionType="create post"
        formAction="/admin/create-post"
        values={values}
        setValues={setValues}
        actionData={actionData}
        navigation={navigation}
        handleFormInputChange={handleFormInputChange}
      />
    </Section>
  );
}
