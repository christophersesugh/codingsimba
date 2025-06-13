import type { Route } from "./+types/change-password";
import { z } from "zod";
import { motion } from "framer-motion";
import { Container } from "./components/container";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "~/utils/db.server";
import {
  getPasswordHash,
  requireUserId,
  verifyUserPassword,
} from "../auth/auh.server";
import { data, Form, Link, useNavigation } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { StatusCodes } from "http-status-codes";
import { redirectWithToast } from "~/utils/toast.server";
import { OptionalContainer } from "~/components/optional-container";

const PasswordSchema = z
  .object({
    intent: z.literal("submit"),
    userId: z.string(),
    userEmail: z.string(),
    currentPassword: z
      .string({
        required_error: "Current password is required.",
      })
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string({
        required_error: "New password is required.",
      })
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string({
        required_error: "Confirm new password.",
      })
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
  });

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, email: true },
  });
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: PasswordSchema.transform(async (data, ctx) => {
      const isValid = await verifyUserPassword(
        { email: data.userEmail },
        data.currentPassword,
      );
      if (!isValid) {
        ctx.addIssue({
          path: ["currentPassword"],
          code: z.ZodIssueCode.custom,
          message: "Incorrect current password.",
        });
        return z.NEVER;
      }
      return { ...data };
    }),
    async: true,
  });
  if (submission.status !== "success") {
    return data({ status: "error", ...submission.reply() } as const, {
      status:
        submission.status === "error"
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.OK,
    });
  }
  if (submission.value.intent !== "submit") {
    return data({ status: "error", ...submission.reply() } as const, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const { userId, newPassword } = submission.value;
  const update = await prisma.password.update({
    where: { userId },
    select: { userId: true },
    data: {
      hash: await getPasswordHash(newPassword),
    },
  });

  if (!update) {
    return data({ status: "error", ...submission.reply() } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
  throw await redirectWithToast("/profile", {
    title: "Password updated",
    description: "You have successfully updated your password",
    type: "success",
  });
}

export default function ChangeEmail({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const user = loaderData.user;
  const isUpdating = navigation.formData?.get("intent") === "submit";

  const [form, fields] = useForm({
    id: "update-password",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PasswordSchema });
    },
    shouldValidate: "onBlur",
  });
  return (
    <OptionalContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-lg"
      >
        <Container
          title="Update your password"
          className="w-full bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80"
        >
          <Form
            {...getFormProps(form)}
            method="post"
            className="mx-auto w-full space-y-6"
          >
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="userEmail" value={user.email} />
            <input type="hidden" name="intent" value="submit" />
            <div className="space-y-2">
              <Label htmlFor={fields.currentPassword.id}>
                Current password
              </Label>
              <Input
                {...getInputProps(fields.currentPassword, {
                  type: "password",
                })}
                placeholder="••••••"
                className="h-12 border-gray-300 bg-white text-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.currentPassword.errors} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.newPassword.id}>New Password</Label>
              <Input
                {...getInputProps(fields.newPassword, { type: "password" })}
                placeholder="••••••"
                className="h-12 border-gray-300 bg-white text-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.newPassword.errors} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.confirmPassword.id}>
                Confirm new password
              </Label>
              <Input
                {...getInputProps(fields.confirmPassword, { type: "password" })}
                placeholder="••••••"
                className="h-12 border-gray-300 bg-white text-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.confirmPassword.errors} />
            </div>
            <FormError errors={form.errors} />
            <div className="flex justify-end">
              <div className="flex gap-4">
                <Link to={"/profile"}>
                  <Button
                    type="button"
                    variant={"outline"}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isUpdating}>
                  Update{" "}
                  {isUpdating ? (
                    <Loader2 className="ml-2 animate-spin" />
                  ) : null}
                </Button>
              </div>
            </div>
          </Form>
        </Container>
      </motion.div>
    </OptionalContainer>
  );
}
