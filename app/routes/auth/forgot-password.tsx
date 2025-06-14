import type { Route } from "./+types/forgot-password";
import { z } from "zod";
import { motion } from "framer-motion";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
// import { prisma } from "~/utils/db.server";
// import { requireUserId } from "~/utils/auth.server";
import { Form, useNavigation } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { Container } from "../profile/components/container";
import { GradientContainer } from "~/components/gradient-container";

const EmailSchema = z.object({
  intent: z.literal("submit"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
});

// export async function loader({ request }: Route.LoaderArgs) {
//   const userId = await requireUserId(request);
//   const user = await prisma.user.findUniqueOrThrow({
//     where: { id: userId },
//     select: { id: true, email: true },
//   });
//   return { user };
// }

export async function action({ request }: Route.ActionArgs) {
  console.log(request);
  return {};
}

export default function ChangePassword({
  actionData,
  // loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  // const user = loaderData.user;
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
    <GradientContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-lg"
      >
        <Container
          title="Reset password"
          description="Enter your email, and we’ll send you a secure link to reset your password."
          className="w-full bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80"
        >
          <Form
            {...getFormProps(form)}
            method="post"
            className="mx-auto w-full space-y-6"
          >
            <input type="hidden" name="intent" value="submit" />
            <div className="space-y-2">
              <Label htmlFor={fields.email.id}>Email</Label>
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
                Reset password{" "}
                {isSubmitting ? (
                  <Loader2 className="ml-2 animate-spin" />
                ) : null}
              </Button>
            </div>
          </Form>
        </Container>
      </motion.div>
    </GradientContainer>
  );
}
