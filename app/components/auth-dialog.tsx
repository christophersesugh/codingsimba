import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { X, Github, LoaderCircle, Mail, CircleCheckBig } from "lucide-react";
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
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  intent: z.literal("submit"),
  redirectTo: z.string().optional(),
});

export function AuthDialog() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { open, closeDialog } = useAuthDialog();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const actionData = useActionData();

  const githubFormAction = "/auth/github";

  const redirectTo = searchParams.get("redirectTo");
  const isSubmittingEmail = navigation.formData?.get("intent") === "submit";
  const isSubmittingGithub =
    navigation.formData?.get("intent") === "submit-github";

  const [form, fields] = useForm({
    id: "auth-form",
    lastResult: actionData,
    defaultValue: { redirectTo },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: authSchema });
    },
    shouldValidate: "onBlur",
  });

  React.useEffect(() => {
    if (actionData?.status === "success") {
      setIsSuccess(true);
    }
  }, [actionData]);

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
            Sign in to access all features
          </DialogDescription>
        </DialogHeader>
        <Form
          action="/"
          method="post"
          {...getFormProps(form)}
          className="space-y-4"
        >
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
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmittingEmail}
            aria-label="Sign in"
          >
            {isSubmittingEmail ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Mail className="mr-2 size-4" />
            )}
            Sign In with Email
          </Button>
        </Form>
        {isSuccess ? (
          <Alert>
            <CircleCheckBig className="size-4 text-green-500" />
            <AlertTitle>Success! Check your email</AlertTitle>
            <AlertDescription>
              We&apos;ve sent a sign-in link to your email address.
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="text-center text-xs uppercase">
          <span className="px-2">Or continue with</span>
        </div>

        <Form method="post" action={githubFormAction}>
          <input type="hidden" name="intent" value="submit-github" />
          <Button variant="outline" type="submit" className="w-full">
            {isSubmittingGithub ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Github className="mr-2 size-4" />
            )}
            GitHub
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
