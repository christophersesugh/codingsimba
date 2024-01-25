import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useRouteError } from "@remix-run/react";
import { ContentErrorUI } from "~/components/content-error-ui";
import { requireUserId } from "~/model/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  if (!userId) {
    throw redirect("/logout");
  }

  return null;
}

export default function AdminRoute() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ContentErrorUI error={error} />;
}
