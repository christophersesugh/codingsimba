import React from "react";
import { Outlet, useRouteError } from "@remix-run/react";
import { ContentErrorUI } from "~/components/content-error-ui";

export default function BlogRoute() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ContentErrorUI error={error} />;
}
