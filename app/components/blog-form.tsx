import React from "react";
import { Form } from "@remix-run/react";
import { FaSpinner } from "react-icons/fa";
import { Editor } from "~/components/markdown";
import { FormInput } from "~/components/form-input";
import { Button } from "~/components/button";

export function BlogForm({
  values,
  setValues,
  navigation,
  actionData,
  formAction,
  handleFormInputChange,
}: any) {
  const isLoading = navigation === "loading";

  return (
    <Form method="POST" action={formAction} className="flex flex-col gap-8">
      <FormInput
        value={values.postTitle}
        id="post-title"
        name="postTitle"
        label="title"
        placeholder="title"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values.postTags}
        id="post-tags"
        name="postTags"
        label="tags"
        placeholder="tasgs"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values.postPhoto}
        id="post-photo"
        name="postPhoto"
        label="photo url"
        placeholder="photo URL"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values.postDescription}
        id="post-description"
        name="postDescription"
        label="description"
        placeholder="description"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values.postVideo}
        id="post-video"
        name="postVideo"
        label="video URL"
        placeholder="video URL"
        onChange={handleFormInputChange}
      />
      <Editor
        value={values.postContent}
        id="post-content"
        name="postContent"
        label="content"
        onChange={handleFormInputChange}
      />
      <div className="self-end flex gap-4">
        <Button
          type="reset"
          aria-label="reset form"
          onClick={() => setValues({})}
          className="capitalize border-2"
        >
          reset
        </Button>
        <Button
          type="submit"
          aria-label={isLoading ? "creating post" : "create post"}
          className="capitalize border-2"
        >
          {isLoading ? (
            <FaSpinner className="text-lg animate-spin" />
          ) : (
            "create post"
          )}
        </Button>
      </div>
      {!actionData?.ok ? (
        <p className="text-red-500">{actionData?.error?.message}</p>
      ) : null}
    </Form>
  );
}
