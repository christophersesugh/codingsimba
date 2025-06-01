import React from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import { getFormProps, useForm } from "@conform-to/react";

export const AcccountInformationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
});

export function AccountInformation() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [form, fields] = useForm({
    id: "account-information",
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                // defaultValue={profile!.name!}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                id="email"
                type="email"
                // defaultValue={user.email}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              // defaultValue={profile?.bio ?? ""}
              rows={4}
              className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                // defaultValue={profile?.location ?? ""}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                // defaultValue={profile?.website ?? ""}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </Form>
      </div>
    </section>
  );
}
