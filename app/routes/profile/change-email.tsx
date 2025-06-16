import type { Route } from "./+types/change-email";
import { z } from "zod";
import { motion } from "framer-motion";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { requireUserId } from "../auth/auh.server";
import { data, Form, Link, redirect } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { GradientContainer } from "~/components/gradient-container";
import { StatusCodes } from "http-status-codes";
import { verifySessionStorage } from "~/utils/verification.server";
import { prisma } from "~/utils/db.server";
import { prepareVerification } from "../auth/verify.server";
import { sendEmail } from "~/services.server/resend";
import { Verification } from "~/components/email-templates/verification";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useIsPending } from "~/utils/misc";

const EmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
});

export const newEmailAddressSessionKey = "new-email-address";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) {
    const params = new URLSearchParams({ redirectTo: request.url });
    throw redirect(`/signin?${params}`);
  }
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: EmailSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { email: true },
      });
      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "This email is already in use.",
        });
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return data(
      { ...submission.reply() },
      {
        status:
          submission.status === "error"
            ? StatusCodes.BAD_REQUEST
            : StatusCodes.OK,
      },
    );
  }
  const { otp, redirectTo, verifyUrl } = await prepareVerification({
    period: 10 * 60,
    request,
    target: userId,
    type: "change_email",
  });

  const response = await sendEmail({
    to: submission.value.email,
    subject: `Coding Simba Email Change Verification`,
    react: <Verification verificationUrl={verifyUrl.toString()} code={otp} />,
  });

  if (response.status === "success") {
    const verifySession = await verifySessionStorage.getSession();
    verifySession.set(newEmailAddressSessionKey, submission.value.email);
    return redirect(redirectTo.toString(), {
      headers: {
        "set-cookie": await verifySessionStorage.commitSession(verifySession),
      },
    });
  } else {
    return data(
      { ...submission.reply({ formErrors: [response.error] }) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export default function ChangeEmail({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const user = loaderData.user;
  const isSubmitting = useIsPending();

  const [form, fields] = useForm({
    id: "change-email",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: EmailSchema });
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
              <CardTitle>
                A confirmation email will be sent to your{" "}
                <strong>new email address</strong>.
              </CardTitle>
              <CardDescription>
                A security notification will also be sent to your current email:{" "}
                <strong className="font-bold">{user.email}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="my-8">
              <div className="space-y-2">
                <Label htmlFor={fields.email.id}>New Email</Label>
                <Input
                  {...getInputProps(fields.email, { type: "email" })}
                  placeholder="johndoe@example.com"
                  className="h-12 border-gray-300 bg-white text-lg dark:border-gray-700 dark:bg-gray-900"
                />
                <FormError errors={fields.email.errors} />
              </div>
              <FormError errors={form.errors} />
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end">
                <div className="flex gap-6">
                  <Button variant={"outline"} asChild>
                    <Link to={"/profile"}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Send confirmation{" "}
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
