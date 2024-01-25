import { type ActionFunctionArgs } from "@remix-run/node";
import React from "react";
import { AuthForm } from "~/components/form";
import { Section } from "~/components/section";
import { createUserSession, login } from "~/model/auth.server";

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const user = await login({ email, password });
    return createUserSession(user?.id);
  } catch (error) {
    throw error;
  }
}

export default function Login() {
  return (
    <Section className="max-w-md">
      <AuthForm title="login" action="/login" />
    </Section>
  );
}
