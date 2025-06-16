/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Route } from "./+types/change-photo";
import { z } from "zod";
import { motion } from "framer-motion";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "~/utils/db.server";
import { requireUserId } from "../../utils/auth.server";
import { Form, Link, useNavigation } from "react-router";
import { FormError } from "~/components/form-errors";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { GradientContainer } from "~/components/gradient-container";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardFooter,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "~/components/ui/card";
import { getInitials } from "~/utils/misc";

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
    select: {
      id: true,
      email: true,
      profile: { select: { image: true, name: true } },
    },
  });
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  console.log(request);
  return {};
}

export default function ChangePhoto({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const user = loaderData.user;
  const profile = user.profile;
  const isSubmitting = navigation.formData?.get("intent") === "submit";

  const [form, fields] = useForm({
    id: "change-photo",
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
        className="mx-auto w-full max-w-md"
      >
        <Card className="w-full bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
          <Form
            {...getFormProps(form)}
            method="post"
            className="mx-auto w-full space-y-6"
          >
            <CardHeader>
              <CardTitle>Update Profile Photo</CardTitle>
              <CardDescription>
                Update your profile picture or delete the current one. Supported
                formats: JPG, PNG, WEBP (Max 3MB).
              </CardDescription>
            </CardHeader>
            <CardContent className="my-8">
              <Avatar className="mx-auto mt-4 size-48 overflow-visible">
                {profile?.image ? (
                  <AvatarImage src={profile.image} alt={profile!.name!} />
                ) : null}
                <AvatarFallback className="text-3xl">
                  {getInitials(profile!.name)}
                </AvatarFallback>
              </Avatar>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end">
                <div className="flex gap-6">
                  <Button variant={"destructive"} type="submit">
                    Delete
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Change{" "}
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
