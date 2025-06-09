import React from "react";
import type { Route } from "../+types/index";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useActionData, useFetcher, useLoaderData } from "react-router";
import { parseWithZod } from "@conform-to/zod";
import { FormError } from "~/components/form-errors";

export const CHANGE_PASSWORD_INTENT = "change-password";
const PASSWORD_LENGTH = 6;

export const PasswordSchema = z.object({
  userId: z.string(),
  email: z.string(),
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(PASSWORD_LENGTH, "Password must be atleast 6 Characters"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(PASSWORD_LENGTH, "Password must be atleast 6 Characters"),
  confirmPassword: z
    .string({ required_error: "Password is required" })
    .min(PASSWORD_LENGTH, "Password must be atleast 6 Characters"),
});

export function ChangePassword() {
  const fetcher = useFetcher();
  const actionData = useActionData() as Route.ComponentProps["actionData"];
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  const user = loaderData.user;
  const isSaving = fetcher.formData?.get("email") === user.email;

  const [form, fields] = useForm({
    id: "password-change",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PasswordSchema });
    },
    shouldValidate: "onBlur",
  });
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <h2 className="text-xl font-bold">Change Password</h2>
      </div>
      <div className="p-6">
        <fetcher.Form
          {...getFormProps(form)}
          method="post"
          className="space-y-6"
        >
          <input type="hidden" name="intent" value={CHANGE_PASSWORD_INTENT} />
          <input
            {...getInputProps(fields.email, { type: "hidden" })}
            value={user.email}
          />
          <input
            {...getInputProps(fields.userId, { type: "hidden" })}
            value={user.id}
          />
          <div className="space-y-2">
            <Label htmlFor={fields.currentPassword.id}>Current Password</Label>
            <Input
              {...getInputProps(fields.currentPassword, { type: "password" })}
              className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
            />
            <FormError errors={fields.currentPassword.errors} />
            {JSON.stringify(fields.currentPassword.errors)}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fields.newPassword.id}>New Password</Label>
              <Input
                {...getInputProps(fields.newPassword, { type: "password" })}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.newPassword.errors} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.confirmPassword.id}>
                Confirm New Password
              </Label>
              <Input
                {...getInputProps(fields.confirmPassword, { type: "password" })}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.confirmPassword.errors} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              Update Password
            </Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
