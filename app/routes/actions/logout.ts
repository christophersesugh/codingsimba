import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { logout } from "~/utils/auth.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  await logout({ request });
  return {};
}
