import type { Route } from "./+types/signin";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { data, Form, Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getInputProps, useForm } from "@conform-to/react";
import { getFormProps } from "@conform-to/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormError } from "~/components/form-errors";
import { Button } from "~/components/ui/button";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { FormConsent } from "~/components/form-consent";
import { ConnectionForm } from "~/components/connection-form";
import { handleNewSession } from "~/utils/session.server";
import { requireAnonymous, signin } from "../../utils/auth.server";
import { EmailSchema, PasswordSchema } from "~/utils/user-validation";
import { useIsPending } from "~/utils/misc";
import { GradientContainer } from "~/components/gradient-container";
import { generateMetadata } from "~/utils/meta";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { checkHoneypot } from "~/utils/honeypot.server";

const SigninSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  redirectTo: z.string().optional(),
  rememberMe: z
    .boolean()
    .optional()
    .transform((val) => (val ? "true" : undefined)),
});

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await checkHoneypot(formData);

  const submission = await parseWithZod(formData, {
    schema: SigninSchema.transform(async (data, ctx) => {
      const { email, password } = data;
      const session = await signin({ email, password });
      if (!session) {
        ctx.addIssue({
          path: ["root"],
          code: z.ZodIssueCode.custom,
          message: "Invalid credentials.",
        });
        return z.NEVER;
      }
      return { ...data, session };
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

  if (!submission.value.session) {
    return data({ status: "error", ...submission.reply() } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const { rememberMe, redirectTo, session } = submission.value;

  return await handleNewSession({
    request,
    session,
    redirectTo,
    rememberMe,
  });
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const metadata = generateMetadata({ title: "Signin | Coding Simba" });
  const isSubmitting = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [form, fields] = useForm({
    id: "signin",
    lastResult: actionData,
    defaultValue: { redirectTo },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SigninSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <>
      {metadata}
      <GradientContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Please enter your credentials</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...getFormProps(form)} method="post" className="space-y-4">
                <HoneypotInputs />
                <div className="space-y-2">
                  <Label htmlFor={fields.email.id}>Email</Label>
                  <Input
                    {...getInputProps(fields.email, { type: "email" })}
                    placeholder="hello@example.com"
                  />
                  <FormError errors={fields.email.errors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={fields.password.id}>Password</Label>
                  <Input
                    {...getInputProps(fields.password, { type: "password" })}
                    placeholder="••••••"
                  />
                  <FormError errors={fields.password.errors} />
                </div>
                <div className="flex justify-between">
                  <Label
                    htmlFor={fields.rememberMe.id}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <input
                      {...getInputProps(fields.rememberMe, {
                        type: "checkbox",
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    />
                    Remember Me
                  </Label>

                  <Link
                    to={"/forgot-password"}
                    className="text-sm text-blue-700 dark:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-label="Sign in"
                >
                  Sign In
                  {isSubmitting ? (
                    <LoaderCircle className="ml-2 animate-spin" />
                  ) : null}
                </Button>
                <FormError
                  errors={form.allErrors.root || form.errors}
                  className="-mt-3"
                />
              </Form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="w-full">
                <ConnectionForm
                  redirectTo={redirectTo}
                  providerName="github"
                  type="Signin"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Signup
                  </Link>
                </p>
              </div>
              <FormConsent type="signin" />
            </CardContent>
          </Card>
        </motion.div>
      </GradientContainer>
    </>
  );
}
