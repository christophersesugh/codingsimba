import React from "react";
import { Form } from "@remix-run/react";
import { FaSpinner } from "react-icons/fa";
import { Editor } from "~/components/markdown";
import { FormInput } from "~/components/form-input";
import { Button } from "~/components/button";

export interface PostValueProps {
  postTitle: string;
  postTags: string;
  postPhoto: string;
  postDescription: string;
  postVideo: string;
  postContent: string;
  postSlug: string;
  postPublished: boolean;
}

export function BlogForm({
  actionType,
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
        value={values?.postTitle ?? values.data?.title}
        id="post-title"
        name="postTitle"
        label="title"
        placeholder="title"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values?.postTags ?? values.data?.tags}
        id="post-tags"
        name="postTags"
        label="tags"
        placeholder="tasgs"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values?.postPhoto ?? values.data?.photo}
        id="post-photo"
        name="postPhoto"
        label="photo url"
        placeholder="photo URL"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values?.postDescription ?? values.data?.description}
        id="post-description"
        name="postDescription"
        label="description"
        placeholder="description"
        onChange={handleFormInputChange}
      />
      <FormInput
        value={values?.postVideo ?? values.data?.video}
        id="post-video"
        name="postVideo"
        label="video URL"
        placeholder="video URL"
        onChange={handleFormInputChange}
      />
      <div className="flex gap-4 items-center">
        <input
          type="checkbox"
          checked={
            values?.postPublished ?? (values.data?.postPublished || false)
          }
          value={values?.published ?? (values.data?.published || false)}
          id="post-published"
          name="postPublished"
          className="block"
          onChange={handleFormInputChange}
        />
        <label htmlFor="post-published">publish post</label>
      </div>
      <Editor
        value={values?.postContent ?? values?.content}
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
            actionType
          )}
        </Button>
      </div>
      {!actionData?.ok ? (
        <p className="text-red-500">{actionData?.error?.message}</p>
      ) : null}
    </Form>
  );
}
