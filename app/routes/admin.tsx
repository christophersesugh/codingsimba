import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { verifyUser } from "~/model/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await verifyUser(request);
  if (!user || user?.role !== "ADMIN") {
    throw redirect("/");
  }
  return null;
}

export default function AdminRoute() {
  return <Outlet />;
}
