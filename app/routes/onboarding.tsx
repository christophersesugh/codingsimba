import React from "react";
import type { Route } from "./+types/onboarding";
import { StatusCodes } from "http-status-codes";
import { Form, data, useNavigation, useNavigate } from "react-router";
import { Camera, Upload, Loader2, Save } from "lucide-react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseFormData } from "@mjackson/form-data-parser";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { createUploadHandler } from "~/utils/storage.server";
import { prisma } from "~/utils/db.server";
import { invariant } from "~/utils/misc";
import { FormError } from "~/components/form-errors";
import { ImageSchema } from "~/utils/storage";

const ProfileSchema = z.object({
  profileImage: ImageSchema,
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 characters." })
    .max(30, {
      message: "Name must be at most 30 characters.",
    }),
  intent: z.literal("submit"),
});

export async function action({ request }: Route.ActionArgs) {
  const [formRequest, fileRequest] = [request.clone(), request.clone()];

  const formData = await formRequest.formData();
  const submission = parseWithZod(formData, { schema: ProfileSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  if (!submission.value || submission.value.intent !== "submit") {
    throw data({ status: "error", submission } as const, {
      status: StatusCodes.BAD_REQUEST,
      statusText: "Bad Request",
    });
  }

  const email = new URL(request.url).searchParams.get("email");
  invariant(email, "User email is required");

  const { name } = submission.value;
  let resolveImage: ((url: string) => void) | undefined;
  const imagePromise = new Promise<string>((resolve) => {
    resolveImage = resolve;
  });

  const fieldName = "profileImage" as const;

  const uploadOptions = {
    fieldName,
    uploadPath: "profile-images",
    generateUniqueFilename: true,
  };

  await parseFormData(
    fileRequest,
    createUploadHandler(uploadOptions, resolveImage),
  );

  const image = await imagePromise.catch(() => null);

  if (!image) {
    throw data({ status: "error", submission } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: "Internal Server Error",
    });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: email },
    select: { id: true },
  });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      profile: {
        upsert: {
          where: { userId: user.id },
          create: { name, image },
          update: { name, image },
        },
      },
    },
    select: { id: true },
  });

  if (!updatedUser) {
    throw data({ status: "error", submission } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: "Internal Server Error",
    });
  }

  return { status: "success", submission } as const;
}

export default function OnboardingRoute({ actionData }: Route.ComponentProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/";

  const [form, fields] = useForm({
    id: "profile-form",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ProfileSchema });
    },
    shouldValidate: "onBlur",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const triggerFileInput = () => fileInputRef.current?.click();

  React.useEffect(() => {
    if (actionData?.status === "success") {
      navigate("/profile", { replace: true });
    }
  }, [actionData, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Add a profile picture and your name to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form
            {...getFormProps(form)}
            method="POST"
            ref={formRef}
            encType="multipart/form-data"
            className="space-y-6"
          >
            <input
              {...getInputProps(fields.intent, { type: "hidden" })}
              value={"submit"}
            />
            <div className="flex flex-col items-center space-y-4">
              <div
                className="relative size-32 cursor-pointer rounded-full border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700"
                onClick={triggerFileInput}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    {isSubmitting ? (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              <input
                {...getInputProps(fields.profileImage, { type: "file" })}
                ref={fileInputRef}
                name="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />

              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isSubmitting}
              >
                <Upload className="mr-2 h-4 w-4" />
                {previewImage ? "Change Photo" : "Upload Photo"}
              </Button>
              <FormError
                errors={fields.profileImage.errors}
                className="-mt-2 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={fields.name.id}>Full Name</Label>
              <Input
                {...getInputProps(fields.name, { type: "text" })}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
              <FormError errors={fields.name.errors} />
            </div>

            <FormError errors={form.errors} />

            <CardFooter className="flex justify-end px-0 pb-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
