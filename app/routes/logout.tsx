import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/model/auth.server";

export const action = async ({ request }: ActionFunctionArgs) =>
  await logout(request);

export const loader = async () => redirect("/");
