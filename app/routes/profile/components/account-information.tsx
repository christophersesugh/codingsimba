import type { Route } from "../+types/index";
import { useActionData, useFetcher, useLoaderData } from "react-router";
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
import { Container } from "./container";

export const ACCOUNT_INFORMATION_INTENT = "update-profile";

export const AcccountInformationSchema = z.object({
  userId: z.string(),
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "First and Last name must be at least 2 characters")
    .max(30, "Name must be less than or equal to 30 characters")
    .trim()
    .refine(
      (name) => {
        const WORD_MIN_LENGTH = 2;
        const words = name.split(/\s+/);

        if (words.length < WORD_MIN_LENGTH) {
          return false;
        }

        return words.every((word) => word.length >= WORD_MIN_LENGTH);
      },
      {
        message:
          "Please enter your first and last name (e.g., John Doe or Kent C. Dodds)",
      },
    ),
  email: z.string().optional(),
  bio: z.string().min(20, "Your bio must be atleast 20 Characters").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  intent: z.literal(ACCOUNT_INFORMATION_INTENT),
});

export function AccountInformation() {
  const fetcher = useFetcher();
  const actionData = useActionData() as Route.ComponentProps["actionData"];
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  const user = loaderData.user;
  const profile = user.profile;
  const isSaving = fetcher.formData?.get("userId") === user.id;

  const [form, fields] = useForm({
    id: "account-information",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AcccountInformationSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: { userId: user.id, intent: ACCOUNT_INFORMATION_INTENT },
  });
  return (
    <Container headerTitle="Account Information" className="mb-8">
      <fetcher.Form {...getFormProps(form)} method="post" className="space-y-6">
        <input type="hidden" name="userId" value={user.id} />
        <input type="hidden" name="intent" value={ACCOUNT_INFORMATION_INTENT} />
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
        <FormError errors={form.errors} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            Save Changes
          </Button>
        </div>
      </fetcher.Form>
    </Container>
  );
}
