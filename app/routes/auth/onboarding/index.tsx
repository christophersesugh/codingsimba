import type { Route } from "./+types/index";
import { z } from "zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import {
  data,
  Form,
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
import { prisma } from "~/utils/db.server";
import { requireAnonymous, sessionKey, signup } from "../auh.server";
import { authSessionStorage } from "~/utils/session.server";
import { verifySessionStorage } from "~/utils/verification.server";
import { safeRedirect } from "remix-utils/safe-redirect";

export const onboardingSessionKey = "onboardingEmail" as const;

const AuthSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "First and Last name must be at least 2 characters")
      .max(30, "Name must be less than or equal to 30 characters")
      .trim()
      .refine(
        (name) => {
          const WORD_MIN_LENGTH = 2;
          const words = name.split(/\s+/);

          if (words.length < WORD_MIN_LENGTH) {
            return false;
          }

          return words.every((word) => word.length >= WORD_MIN_LENGTH);
        },
        {
          message:
            "Please enter your first and last name (e.g., John Doe or Kent C. Dodds)",
        },
      ),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .max(30, "Password must be less than or equal to 30 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter (A), one lowercase letter (a), one number (3) and one special character (&)",
      ),
    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(6, "Password must be at least 6 characters long"),
    intent: z.literal("submit"),
    email: z.string().email().trim().toLowerCase(),
    redirectTo: z.string().optional(),
    rememberMe: z
      .boolean()
      .optional()
      .transform((val) => (val ? "true" : undefined)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

async function requireOnboardingEmail(request: Request) {
  const verifySesison = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const email = await verifySesison.get(onboardingSessionKey);

  if (typeof email !== "string" || !email) {
    throw redirect("/signup");
  }
  return email;
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
  const email = await requireOnboardingEmail(request);
  return { email };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: AuthSchema.transform(async (data, ctx) => {
      const { name, password, email, intent } = data;

      if (intent !== "submit") {
        return { ...data, session: null };
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        ctx.addIssue({
          path: ["root"],
          code: z.ZodIssueCode.custom,
          message: "Email already in use, Please sign in instead.",
        });
        return z.NEVER;
      }

      try {
        const session = await signup({
          email,
          name: name.trim().replace(/\s+/g, " "),
          password,
        });

        if (!session) {
          ctx.addIssue({
            path: ["root"],
            code: z.ZodIssueCode.custom,
            message: "Failed to create account. Please try again.",
          });
          return z.NEVER;
        }

        return { ...data, session };
      } catch (e) {
        console.error(e);

        ctx.addIssue({
          path: ["root"],
          code: z.ZodIssueCode.custom,
          message: "An unexpected error occurred. Please try again.",
        });
        return z.NEVER;
      }
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

  const { rememberMe, session, redirectTo } = submission.value;

  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie"),
  );

  authSession.set(sessionKey, session.id);

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );

  const headers = new Headers();
  headers.append(
    "set-cookie",
    await authSessionStorage.commitSession(authSession, {
      expires: rememberMe ? session.expirationDate : undefined,
    }),
  );

  headers.append(
    "set-cookie",
    await verifySessionStorage.destroySession(verifySession),
  );

  return redirect(safeRedirect(redirectTo), { headers });
}

export default function Onboarding({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const [form, fields] = useForm({
    id: "onboarding",
    lastResult: actionData,
    defaultValue: { redirectTo },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AuthSchema });
    },
    shouldValidate: "onBlur",
  });

  const isSubmitting = navigation.formData?.get("intent") === "submit";
  const email = loaderData.email;

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
            <CardTitle className="text-xl">Welcome aboard {email}</CardTitle>
            <CardDescription>Please enter your details</CardDescription>
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
              <input
                {...getInputProps(fields.email, { type: "hidden" })}
                value={email}
              />
              <div className="space-y-2">
                <Label htmlFor={fields.name.id}>Name</Label>
                <Input
                  {...getInputProps(fields.name, { type: "text" })}
                  placeholder="Kent C. Dodds"
                />
                <FormError errors={fields.name.errors} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={fields.password.id}>Password</Label>
                <Input
                  {...getInputProps(fields.password, { type: "password" })}
                  placeholder="••••••"
                />
                <FormError errors={fields.password.errors} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={fields.confirmPassword.id}>
                  Confirm password
                </Label>
                <Input
                  {...getInputProps(fields.confirmPassword, {
                    type: "password",
                  })}
                  placeholder="••••••"
                />
                <FormError errors={fields.confirmPassword.errors} />
              </div>
              <div className="flex justify-between">
                <Label
                  htmlFor={fields.rememberMe.id}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <input
                    {...getInputProps(fields.rememberMe, { type: "checkbox" })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                  />
                  Remember Me
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                aria-label="Create account"
              >
                Create account{" "}
                {isSubmitting ? (
                  <LoaderCircle className="ml-2 animate-spin" />
                ) : null}
              </Button>
              <FormError errors={form.allErrors.root || form.errors} />
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
