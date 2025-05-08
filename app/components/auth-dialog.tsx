import React from "react";
import type { Route } from "../+types/root";
// import type { Route as SignupRoute } from "../routes/actions/+types/signin";
// import type { Route as SigninRoute } from "../routes/actions/+types/signup";

import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { X, Github, LoaderCircle, AtSign } from "lucide-react";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuthDialog } from "~/contexts/auth-dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { FormError } from "./form-error";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { capitalizeName } from "~/utils/user";

export const authTypes = ["signup", "signin"] as const;

export type AuthType = (typeof authTypes)[number];

export const AuthSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }).optional(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password cannot be longer than 20 characters"),
    intent: z.literal("submit"),
    authType: z.enum(authTypes),
    redirectTo: z.string().optional(),
    rememberMe: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.authType === "signup") {
      const name = data.name?.trim() ?? "";

      if (!name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "Name is required",
        });
        return z.NEVER;
      }

      const words = name.split(/\s+/);
      if (words.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message:
            "Please enter your first and last name (e.g., John Doe or Kent C. Dodds)",
        });
        return z.NEVER;
      }

      data.name = capitalizeName(name);
    }
  });

export function AuthDialog() {
  const [authType, setAuthType] = React.useState<AuthType>("signin");
  const { open, closeDialog } = useAuthDialog();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const actionData = useActionData() as Route.ComponentProps["actionData"];

  const githubFormAction = "/auth/github";
  const isSignup = authType === "signup";

  const redirectTo = searchParams.get("redirectTo");
  const isSubmittingEmail = navigation.formData?.get("intent") === "submit";
  const isSubmittingGithub =
    navigation.formData?.get("intent") === "submit-github";

  const [form, fields] = useForm({
    id: "auth-form",
    lastResult: actionData,
    defaultValue: { redirectTo },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AuthSchema });
    },
    shouldValidate: "onBlur",
  });

  React.useEffect(() => {
    if (actionData?.status === "success") closeDialog();
  }, [actionData?.status, closeDialog]);

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <VisuallyHidden>Close</VisuallyHidden>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Coding Simba
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSignup ? "Create an account" : "Welcome back!"}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={authType} className="bg-inherit text-inherit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup" onClick={() => setAuthType("signup")}>
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="signin" onClick={() => setAuthType("signin")}>
              Sign In
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Form
          {...getFormProps(form)}
          action="/"
          method="post"
          className="space-y-4"
        >
          <input
            {...getInputProps(fields.authType, { type: "hidden" })}
            value={authType}
          />
          <input
            {...getInputProps(fields.intent, { type: "hidden" })}
            value="submit"
          />
          <input
            {...getInputProps(fields.redirectTo, { type: "hidden" })}
            value={redirectTo ?? ""}
          />
          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor={fields.name.id}>Full Name</Label>
              <Input
                {...getInputProps(fields.name, { type: "text" })}
                placeholder="John Doe"
              />
              <FormError errors={fields.name.errors} />
            </div>
          ) : null}
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
          <div>
            <div className="flex justify-between">
              <Label
                htmlFor={fields.rememberMe.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  {...getInputProps(fields.rememberMe, { type: "checkbox" })}
                />
                Remember Me
              </Label>
              {isSignup ? null : (
                <Link
                  to={"forgot-password"}
                  className="text-sm text-blue-700 dark:text-blue-500"
                >
                  Forgot your password?
                </Link>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmittingEmail}
            aria-label={isSignup ? "Sign up" : "Sign in"}
          >
            {isSubmittingEmail ? (
              <LoaderCircle className="mr-1 size-4 animate-spin" />
            ) : (
              <AtSign className="mr-1 size-4" />
            )}
            Sign {isSignup ? "Up" : "In"}
          </Button>
          <FormError
            errors={form.allErrors.root || form.errors}
            className="-mt-2 text-center !text-xs"
          />
        </Form>

        <div className="text-center text-xs uppercase">
          <span className="px-2">Or continue with</span>
        </div>

        <Form method="post" action={githubFormAction}>
          <input type="hidden" name="intent" value="submit-github" />
          <Button variant="outline" type="submit" className="w-full">
            {isSubmittingGithub ? (
              <LoaderCircle className="mr-1 size-4 animate-spin" />
            ) : (
              <Github className="mr-1 size-4" />
            )}
            GitHub
          </Button>
        </Form>
        <p className="-my-1 text-xs">
          By signing {isSignup ? "up" : "in"}, you agree to our{" "}
          <Link
            to={"terms"}
            onClick={() => closeDialog()}
            className="text-blue-700 dark:text-blue-500"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to={"privacy"}
            onClick={() => closeDialog()}
            className="text-blue-700 dark:text-blue-500"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
