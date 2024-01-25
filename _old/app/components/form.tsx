import React from "react";
import { Form } from "@remix-run/react";
import { FormInput } from "./form-input";
import { Button } from "./button";

export function AuthForm({
  method = "POST",
  title,
  action,
  ...props
}: {
  method?: "GET" | "POST";
  title: string;
  action: string;
}) {
  return (
    <Form
      method={method}
      {...props}
      className="w-full rounded-md border-2 p-4 flex flex-col gap-8 my-12"
    >
      <h1 className="self-start capitalize text-2xl">{title}</h1>
      <FormInput type="email" name="email" id="email" placeholder="email" />
      <FormInput
        type="password"
        name="password"
        id="password"
        placeholder="password"
      />
      <Button type="submit" className="self-end border">
        submit
      </Button>
    </Form>
  );
}
