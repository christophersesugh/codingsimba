import type { Route } from "./+types/signup";
import { z } from "zod";
import { motion } from "framer-motion";
import { generateTOTP } from "@epic-web/totp";
import { LoaderCircle } from "lucide-react";
import {
  data,
  Form,
  Link,
  redirect,
  useNavigation,
  useSearchParams,
} from "react-router";
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
import { StatusCodes } from "http-status-codes";
import { FormConsent } from "~/components/form-consent";
import { SignupEmail } from "~/components/email-templates/verification";
import { onboardingSessionKey } from "./onboarding";
import { sendEmail } from "~/services.server/resend";
import { verifySessionStorage } from "~/utils/verification.server";
import { getDomainUrl } from "~/utils/misc";
import { prisma } from "~/utils/db.server";
import type { Verification } from "~/generated/prisma";
import { codeQueryParam, targetQueryParam, typeQueryParam } from "./verify";
import { ConnectionForm } from "~/components/connection-form";
import { requireAnonymous } from "./auh.server";

const AuthSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  intent: z.literal("submit"),
  redirectTo: z.string().optional(),
  rememberMe: z.string().optional(),
});

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: AuthSchema,
  });

  if (submission.status !== "success") {
    return data({ status: "error", ...submission.reply() } as const, {
      status:
        submission.status === "error"
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.OK,
    });
  }

  const { email } = submission.value;

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );

  verifySession.set(onboardingSessionKey, email);

  const { otp, ...verificationConfig } = await generateTOTP({
    period: 10 * 60,
    algorithm: "SHA-256",
  });

  const redirectToUrl = new URL(`${getDomainUrl(request)}/verify`);
  const type = "onboarding" as Verification["type"];
  redirectToUrl.searchParams.set(typeQueryParam, type);
  redirectToUrl.searchParams.set(targetQueryParam, email);

  const verifyUrl = new URL(redirectToUrl);
  verifyUrl.searchParams.set(codeQueryParam, otp);

  const verificationData = {
    type,
    target: email,
    ...verificationConfig,
    expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
  };

  await prisma.verification.upsert({
    where: { target_type: { type, target: email } },
    create: verificationData,
    update: verificationData,
  });

  const response = await sendEmail({
    to: email,
    subject: `Welcome to Coding Simba!`,
    react: <SignupEmail code={otp} onboardingUrl={verifyUrl.toString()} />,
  });

  if (response.status === "success") {
    return redirect(redirectToUrl.toString());
  } else {
    return data(
      { ...submission.reply({ formErrors: [response.error] }) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const [form, fields] = useForm({
    id: "signup",
    lastResult: actionData,
    defaultValue: { redirectTo },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AuthSchema });
    },
    shouldValidate: "onBlur",
  });

  const isSubmitting = navigation.formData?.get("intent") === "submit";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Let&apos;s Begin!</CardTitle>
            <CardDescription>Enter your email to continue</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...getFormProps(form)} method="post" className="space-y-4">
              <input
                {...getInputProps(fields.intent, { type: "hidden" })}
                value="submit"
              />
              <input
                {...getInputProps(fields.redirectTo, { type: "hidden" })}
                value={redirectTo ?? ""}
              />
              <div className="space-y-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input
                  {...getInputProps(fields.email, { type: "email" })}
                  placeholder="hello@example.com"
                />
                <FormError errors={fields.email.errors} />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                aria-label="Signup"
              >
                Submit{" "}
                {isSubmitting ? (
                  <LoaderCircle className="ml-2 animate-spin" />
                ) : null}
              </Button>
              <FormError errors={form.allErrors.root || form.errors} />
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
                type="Signup"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Signin
                </Link>
              </p>
            </div>
            <FormConsent type="signup" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
