import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUser } from "~/model/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") {
    throw redirect("/");
  }
  return json({ user });
}

export default function AdminRoute() {
  return <Outlet />;
}
