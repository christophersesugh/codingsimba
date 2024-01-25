import React from "react";
import { type ActionFunctionArgs } from "@remix-run/node";
import { AuthForm } from "~/components/form";
import { Section } from "~/components/section";
import { createUserSession, register } from "~/model/auth.server";

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const user = await register({ email, password });
    return createUserSession(user.id);
  } catch (error) {
    return error;
  }
}

export default function Register() {
  return (
    <Section className="max-w-md">
      <AuthForm title="register" action="/register" />
    </Section>
  );
}
