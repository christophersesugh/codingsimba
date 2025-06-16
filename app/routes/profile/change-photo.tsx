/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Route } from "./+types/change-photo";
import React from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "~/utils/db.server";
import { requireUserId } from "../../utils/auth.server";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { GradientContainer } from "~/components/gradient-container";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardFooter,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "~/components/ui/card";
import { getInitials, useIsPending } from "~/utils/misc";
import { parseFormData } from "@mjackson/form-data-parser";

const MAX_SIZE = 1024 * 1024 * 3; // 3MB

const DeleteImageSchema = z.object({
  intent: z.literal("delete"),
});

const NewImageSchema = z.object({
  intent: z.literal("submit"),
  photoFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required")
    .refine(
      (file) => file.size <= MAX_SIZE,
      "Image size must be less than 3MB",
    ),
});

const PhotoFormSchema = z.discriminatedUnion("intent", [
  DeleteImageSchema,
  NewImageSchema,
]);

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      profile: { select: { image: true, name: true } },
    },
  });
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await parseFormData(request, { maxFileSize: MAX_SIZE });
  const submission = await parseWithZod(formData, {
    schema: PhotoFormSchema.transform(async (data) => {
      if (data.intent === "delete") return { intent: "delete" };
      if (data.photoFile.size <= 0) return z.NEVER;
      return {
        intent: data.intent,
        image: {
          // objectKey: await uploadProfileImage(userId, data.photoFile),
        },
      };
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return data(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const { image, intent } = submission.value;

  // if (intent === "delete") {
  //   await prisma.userImage.deleteMany({ where: { userId } });
  //   return redirect("/profile");
  // }

  // await prisma.$transaction(async ($prisma) => {
  //   await $prisma.userImage.deleteMany({ where: { userId } });
  //   await $prisma.user.update({
  //     where: { id: userId },
  //     data: { image: { create: image } },
  //   });
  // });

  return redirect("/profile");
}

export default function ChangePhoto({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const user = loaderData.user;
  const profile = user.profile;
  const isSubmitting = useIsPending();

  const [form, fields] = useForm({
    id: "change-photo",
    // lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PhotoFormSchema });
    },
    shouldValidate: "onBlur",
  });
  const isPending = useIsPending();
  const navigation = useNavigation();
  const pendingIntent = isPending ? navigation.formData?.get("intent") : null;
  const lastSubmissionIntent = fields.intent.value;
  const [newImageSrc, setNewImageSrc] = React.useState<string | null>(null);
  return (
    <GradientContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-md"
      >
        <Card className="w-full bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
          <Form
            method="POST"
            encType="multipart/form-data"
            onReset={() => setNewImageSrc(null)}
            {...getFormProps(form)}
            className="mx-auto w-full space-y-6"
          >
            <CardHeader>
              <CardTitle>Update Profile Photo</CardTitle>
              <CardDescription>
                Update your profile picture or delete the current one. Supported
                formats: JPG, PNG, WEBP (Max 3MB).
              </CardDescription>
            </CardHeader>
            <CardContent className="my-8">
              <Avatar className="mx-auto mt-4 size-48 overflow-visible">
                {profile?.image ? (
                  <AvatarImage src={profile.image} alt={profile!.name!} />
                ) : null}
                <AvatarFallback className="text-3xl">
                  {getInitials(profile!.name)}
                </AvatarFallback>
              </Avatar>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end">
                <div className="flex gap-6">
                  <Button variant={"destructive"} type="submit">
                    Delete
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Change{" "}
                    {isSubmitting ? (
                      <Loader2 className="ml-2 animate-spin" />
                    ) : null}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Form>
        </Card>
      </motion.div>
    </GradientContainer>
  );
}
