import type { Route } from "./+types/reset-password";
import { z } from "zod";
import { motion } from "framer-motion";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "~/utils/db.server";
import { getPasswordHash, requireAnonymous } from "./auh.server";
import { data, Form, Link, redirect } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { StatusCodes } from "http-status-codes";
import { GradientContainer } from "~/components/gradient-container";
import { useIsPending } from "~/utils/misc";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { verifySessionStorage } from "~/utils/verification.server";
import { resetPasswordEmailSessionKey } from "./forgot-password";

const PasswordSchema = z
  .object({
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

async function requireResetPasswordEmail(request: Request) {
  await requireAnonymous(request);
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const resetPasswordEmail = verifySession.get(resetPasswordEmailSessionKey);
  if (typeof resetPasswordEmail !== "string" || !resetPasswordEmail) {
    throw redirect("/signin");
  }
  return resetPasswordEmail;
}

export async function loader({ request }: Route.LoaderArgs) {
  const resetPasswordEmail = await requireResetPasswordEmail(request);
  return { resetPasswordEmail };
}

export async function action({ request }: Route.ActionArgs) {
  const userEmail = await requireResetPasswordEmail(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: PasswordSchema,
  });
  if (submission.status !== "success") {
    return data({ status: "error", ...submission.reply() } as const, {
      status:
        submission.status === "error"
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.OK,
    });
  }

  const { newPassword } = submission.value;
  const update = await prisma.user.update({
    where: { email: userEmail },
    select: { id: true },
    data: {
      password: {
        update: {
          hash: await getPasswordHash(newPassword),
        },
      },
    },
  });
  if (!update) {
    return data({ status: "error", ...submission.reply() } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
  const verifySession = await verifySessionStorage.getSession();
  throw redirect("/signin", {
    headers: {
      "set-cookie": await verifySessionStorage.destroySession(verifySession),
    },
  });
}

export default function ResetPasswordRoute({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const isUpdating = useIsPending();
  const [form, fields] = useForm({
    id: "reset-password",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PasswordSchema });
    },
    shouldValidate: "onBlur",
  });
  return (
    <GradientContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-lg"
      >
        <Card className="w-full bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
          <Form
            {...getFormProps(form)}
            method="post"
            className="mx-auto w-full space-y-6"
          >
            <CardHeader>
              <CardTitle>Password reset</CardTitle>
              <CardDescription>
                Reset your password {loaderData.resetPasswordEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="my-8 space-y-6">
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
                  {...getInputProps(fields.confirmPassword, {
                    type: "password",
                  })}
                  placeholder="••••••"
                  className="h-12 border-gray-300 bg-white text-lg dark:border-gray-700 dark:bg-gray-900"
                />
                <FormError errors={fields.confirmPassword.errors} />
              </div>
              <FormError errors={form.errors} />
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end">
                <div className="flex gap-4">
                  <Link to={"/forgot-password"}>
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
            </CardFooter>
          </Form>
        </Card>
      </motion.div>
    </GradientContainer>
  );
}
