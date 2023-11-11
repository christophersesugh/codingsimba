import React from "react";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { AuthForm } from "~/components/form";
import { Section } from "~/components/section";
import { register } from "~/model/auth.server";

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const admin = "ADMIN";
  try {
    const user = await register({ email, password });
    if (user.role === admin) {
      return redirect("/admin");
    }
    return redirect("/");
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
