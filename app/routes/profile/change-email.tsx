import type { Route } from "./+types/change-email";
import { z } from "zod";
import { motion } from "framer-motion";
import { Container } from "./components/container";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "~/utils/db.server";
import { requireUserId } from "../auth/auh.server";
import { Form, useNavigation } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { OptionalContainer } from "~/components/optional-container";

const EmailSchema = z.object({
  intent: z.literal("submit"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
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
  console.log(request);
  return {};
}

export default function ChangeEmail({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const user = loaderData.user;
  const isSubmitting = navigation.formData?.get("intent") === "submit";

  const [form, fields] = useForm({
    id: "update-password",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: EmailSchema });
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
          title="Change your email"
          description={
            <div className="text-sm">
              <p>
                A confirmation email will be sent to your{" "}
                <strong>new email address</strong>.
              </p>
              <p>
                A security notification will also be sent to your current email:{" "}
                <strong className="font-bold">{user.email}</strong>.
              </p>
            </div>
          }
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
              <Label htmlFor={fields.email.id}>New Email</Label>
              <Input
                {...getInputProps(fields.email, { type: "email" })}
                placeholder="johndoe@example.com"
                className="h-12 border-gray-300 bg-white text-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <FormError errors={fields.email.errors} />
            </div>
            <FormError errors={form.errors} />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                Send confirmation{" "}
                {isSubmitting ? (
                  <Loader2 className="ml-2 animate-spin" />
                ) : null}
              </Button>
            </div>
          </Form>
        </Container>
      </motion.div>
    </OptionalContainer>
  );
}
