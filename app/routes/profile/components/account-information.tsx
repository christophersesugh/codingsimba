import React from "react";
import type { Route } from "../+types/index";
import { Form, useActionData, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import {
  getFieldsetProps,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { FormError } from "~/components/form-errors";

export const AcccountInformationSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  bio: z.string().min(20, "Your bio must be atleast 20 Characters").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  intent: z.literal("submit"),
});

export function AccountInformation() {
  const actionData = useActionData() as Route.ComponentProps["actionData"];
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  const user = loaderData.user;
  const profile = user.profile;

  const [form, fields] = useForm({
    id: "account-information",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AcccountInformationSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: { intent: "submit" },
  });
  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <h2 className="text-xl font-bold">Account Information</h2>
      </div>
      <div className="p-6">
        <Form {...getFormProps(form)} method="post" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fields.name.id}>Name</Label>
              <Input
                {...getInputProps(fields.name, { type: "text" })}
                defaultValue={profile!.name!}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.name.errors} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input
                {...getInputProps(fields.email, { type: "email" })}
                defaultValue={user.email}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                disabled
              />
              <FormError errors={fields.email.errors} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fields.bio.id}>Bio</Label>
            <Textarea
              {...getFieldsetProps(fields.bio)}
              defaultValue={profile?.bio ?? ""}
              rows={4}
              className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
            />
            <FormError errors={fields.bio.errors} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fields.location.id}>Location</Label>
              <Input
                {...getInputProps(fields.location, { type: "text" })}
                defaultValue={profile?.location ?? ""}
                placeholder="e.g. Netherlands"
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.location.errors} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.website.id}>Website</Label>
              <Input
                {...getInputProps(fields.website, { type: "url" })}
                defaultValue={profile?.website ?? ""}
                placeholder="https://example.com"
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.website.errors} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </Form>
      </div>
    </section>
  );
}
