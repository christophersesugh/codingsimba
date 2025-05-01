import type { Route } from "../+types/root";
import { useRouteLoaderData } from "react-router";

function isUser(
  user: unknown,
): user is Awaited<Route.ComponentProps["loaderData"]["user"]> {
  return !!user && typeof user === "object" && user !== null;
}

export function useOptionalUser() {
  const data = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root");

  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}
