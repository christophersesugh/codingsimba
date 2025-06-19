import { redirect } from "react-router";
import type { Route } from "../actions/+types/sanity-webhook";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  console.log(await request);
  return {};
}
