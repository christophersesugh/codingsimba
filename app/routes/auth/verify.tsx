import React from "react";
import type { Route } from "./+types/verify";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  RefreshCw,
  RectangleEllipsis,
  MailQuestion,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import {
  getFormProps,
  getInputProps,
  useForm,
  type Submission,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useNavigate, useSearchParams } from "react-router";
import { FormError } from "~/components/form-errors";
import { validateRequest } from "./verify.server";
import { checkHoneypot } from "~/utils/honeypot.server";
import { useIsPending } from "~/utils/misc";
import { generateMetadata } from "~/utils/meta";

export const codeQueryParam = "code";
export const targetQueryParam = "target";
export const typeQueryParam = "type";
export const redirectToQueryParam = "redirectTo";

const types = ["onboarding", "reset_password", "change_email"] as const;
const VerificationTypeSchema = z.enum(types);
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>;

export const VerifySchema = z.object({
  [codeQueryParam]: z
    .string({ required_error: "OTP is required." })
    .min(6)
    .max(6),
  [targetQueryParam]: z.string(),
  [typeQueryParam]: VerificationTypeSchema,
  [redirectToQueryParam]: z.string().optional(),
});
export type VerifyFunctionArgs = {
  request: Request;
  submission: Submission<z.infer<typeof VerifySchema>>;
  body: FormData | URLSearchParams;
};

export async function loader({ request }: Route.LoaderArgs) {
  const params = new URL(request.url).searchParams;
  if (!params.has(codeQueryParam)) {
    return {
      status: "error",
      payload: Object.fromEntries(params) as Record<string, unknown>,
      error: {} as Record<string, Array<string>>,
    } as const;
  }

  return validateRequest(request, params);
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await checkHoneypot(formData);
  return validateRequest(request, formData);
}

export default function VerifyPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const metadata = generateMetadata({ title: "Verify | Coding Simba" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isVerifying = useIsPending();
  const parseWithZoddType = VerificationTypeSchema.safeParse(
    searchParams.get(typeQueryParam),
  );
  const type = parseWithZoddType.success ? parseWithZoddType.data : null;

  const [form, fields] = useForm<z.infer<typeof VerifySchema>>({
    id: "verify",
    lastResult: actionData ?? loaderData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifySchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      code: searchParams.get(codeQueryParam),
      type: searchParams.get(typeQueryParam),
      target: searchParams.get(targetQueryParam),
      redirectTo: searchParams.get(redirectToQueryParam),
    },
  });

  const onboarding = (
    <>
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
      <p className="text-gray-600 dark:text-gray-400">
        We&apos;ve sent a verification code to
      </p>
      <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
        {fields.target.value}
      </p>
    </>
  );

  const resetPassword = (
    <>
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <RectangleEllipsis className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
      <p className="text-gray-600 dark:text-gray-400">
        We&apos;ve sent you a code to reset your password
      </p>
    </>
  );
  const changeEmail = (
    <>
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MailQuestion className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
      <p className="text-gray-600 dark:text-gray-400">
        We&apos;ve sent you a code to verify your email address
      </p>
    </>
  );
  const headings: Record<VerificationTypes, React.ReactNode> = {
    onboarding,
    reset_password: resetPassword,
    change_email: changeEmail,
  };

  const OTP_LENGTH = 6;

  return (
    <>
      {metadata}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900"
        >
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <div className="mb-8 text-center">
            {type ? headings[type] : "Invalid type"}
          </div>

          <Form {...getFormProps(form)} method="post" className="w-full">
            <input
              {...getInputProps(fields[typeQueryParam], { type: "hidden" })}
            />
            <input
              {...getInputProps(fields[targetQueryParam], { type: "hidden" })}
            />
            <input
              {...getInputProps(fields[redirectToQueryParam], {
                type: "hidden",
              })}
            />

            <div className="mx-auto mb-6 flex w-full justify-center">
              <InputOTP
                {...getInputProps(fields[codeQueryParam], { type: "text" })}
                maxLength={OTP_LENGTH}
                autoFocus
              >
                <InputOTPGroup>
                  {[...Array(OTP_LENGTH)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <FormError
              errors={fields[codeQueryParam].errors}
              className="mb-6"
            />
            <Button
              type="submit"
              className="mb-6 w-full"
              disabled={isVerifying}
            >
              {type === "reset_password" ? "Reset Password" : "Verify Email"}
              {isVerifying ? (
                <RefreshCw className="mr-2 size-4 animate-spin" />
              ) : null}
            </Button>
            <FormError errors={form.errors} />
          </Form>
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
            <p className="text-center text-xs text-gray-500 dark:text-gray-500">
              Check your spam folder if you don&apos;t see the email. The code
              expires in 10 minutes.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
