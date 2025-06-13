import React from "react";
import type { Route } from "./+types/verify";
import { TOTP } from "~/utils/totp.server";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
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
import {
  data,
  Form,
  redirect,
  // useFetcher,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router";
import { FormError } from "~/components/form-errors";
import { prisma } from "~/utils/db.server";
import { StatusCodes } from "http-status-codes";
import type { Verification } from "~/generated/prisma";
import { verifySessionStorage } from "~/utils/verification.server";
import { onboardingSessionKey } from "./onboarding";

async function validateRequest(
  request: Request,
  body: URLSearchParams | FormData,
) {
  const submission = await parseWithZod(body, {
    schema: VerifySchema.superRefine(async (data, ctx) => {
      const verification = await prisma.verification.findUnique({
        where: {
          target_type: {
            target: data[targetQueryParam],
            type: data[typeQueryParam],
          },
          OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
        },
      });

      if (!verification) {
        ctx.addIssue({
          path: ["code"],
          code: z.ZodIssueCode.custom,
          message: `Invalid code`,
        });
        return z.NEVER;
      }

      const codeIsValid = await TOTP.verifyTOTP({
        otp: data[codeQueryParam],
        ...verification,
      });

      if (!codeIsValid) {
        ctx.addIssue({
          path: ["code"],
          code: z.ZodIssueCode.custom,
          message: `Invalid code`,
        });
        return z.NEVER;
      }
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return data({ status: "error", ...submission.reply() } as const, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  if (submission.payload.intent !== "submit") {
    return data({ status: "error", ...submission.reply() } as const);
  }
  const { payload: submissionValue } = submission;

  // async function deleteVerification() {
  await prisma.verification.delete({
    where: {
      target_type: {
        target: submissionValue.target as Verification["target"],
        type: submissionValue.type as Verification["type"],
      },
    },
  });
  // }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );

  verifySession.set(onboardingSessionKey, submissionValue.target);

  return redirect("/onboarding", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession),
    },
  });

  // switch (submissionValue[typeQueryParam]) {
  //   case "onboarding": {
  //     await deleteVerification();
  //     return handleOnboardingVerification({ request, body, submission });
  //   }
  // case "reset-password": {
  //   await deleteVerification();
  //   return handleResetPasswordVerification({ request, body, submission });
  // }
  // case "change-email": {
  //   await deleteVerification();
  //   return handleChangeEmailVerification({ request, body, submission });
  // }
  // case "2fa": {
  //   return handleLoginTwoFactorVerification({ request, body, submission });
  // }
  // }
}

export const codeQueryParam = "code";
export const targetQueryParam = "target";
export const typeQueryParam = "type";
export const redirectToQueryParam = "redirectTo";

const types = ["onboarding"] as const;
const VerificationTypeSchema = z.enum(types);
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>;

const VerifySchema = z.object({
  [codeQueryParam]: z
    .string({ required_error: "OTP is required." })
    .min(6)
    .max(6),
  [targetQueryParam]: z.string(),
  [typeQueryParam]: VerificationTypeSchema,
  [redirectToQueryParam]: z.string().optional(),
  intent: z.literal("submit"),
});
export type VerifyFunctionArgs = {
  request: Request;
  submission: Submission<z.infer<typeof VerifySchema>>;
  body: FormData | URLSearchParams;
};

export async function loader({ request }: Route.LoaderArgs) {
  const params = new URL(request.url).searchParams;
  if (!params.has(codeQueryParam)) {
    return data({
      status: "error",
      submission: {
        payload: Object.fromEntries(params) as Record<string, unknown>,
        error: {} as Record<string, Array<string>>,
      },
    } as const);
  }
  return validateRequest(request, params);
}

// const RESEND_OTP_INTENT = "resend-otp";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  return validateRequest(request, formData);
}

export default function VerifyPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [resendCountdown, setResendCountdown] = React.useState(0);

  const navigate = useNavigate();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  // const fetcher = useFetcher();

  const isVerifying = navigation.formData?.get("intent") === "submit";

  const [form, fields] = useForm({
    id: "verify",
    lastResult: actionData ?? loaderData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifySchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      code: searchParams.get(codeQueryParam) ?? "",
      type: searchParams.get(typeQueryParam) ?? "",
      target: searchParams.get(targetQueryParam) ?? "",
      redirectTo: searchParams.get(redirectToQueryParam) ?? "",
    },
  });

  // function handleResendOtp() {
  //   setResendCountdown(60);
  //   fetcher.submit({ intent: RESEND_OTP_INTENT }, { method: "post" });
  // }

  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const OTP_LENGTH = 6;

  return (
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
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
            {fields.target.value}
          </p>
        </div>

        <Form {...getFormProps(form)} method="post" className="w-full">
          <input
            {...getInputProps(fields[typeQueryParam], { type: "hidden" })}
          />
          <input
            {...getInputProps(fields[targetQueryParam], { type: "hidden" })}
          />
          <input
            {...getInputProps(fields[redirectToQueryParam], { type: "hidden" })}
          />
          <input
            {...getInputProps(fields.intent, { type: "hidden" })}
            value="submit"
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
          <FormError errors={fields[codeQueryParam].errors} className="mb-6" />
          <Button type="submit" className="mb-6 w-full" disabled={isVerifying}>
            Verify Email
            {isVerifying ? (
              <RefreshCw className="mr-2 size-4 animate-spin" />
            ) : null}
          </Button>
          <FormError errors={form.errors} />
        </Form>

        {/* <div className="text-center">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?
          </p>
          {resendCountdown > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Resend code in {resendCountdown} seconds
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Resend verification code
            </button>
          )}
        </div> */}

        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Check your spam folder if you don&apos;t see the email. The code
            expires in 10 minutes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
