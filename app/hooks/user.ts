import type { Route } from "../+types/root";
import { useRouteLoaderData } from "react-router";

/**
 * Type guard to check if a value is a valid user object.
 * Validates that the value is a non-null object with required user properties.
 *
 * @param user - The value to check
 * @returns True if the value is a valid user object with required properties
 *
 * @example
 * ```ts
 * const data = { user: { id: '123', name: 'John', roles: [] } };
 * if (isUser(data.user)) {
 *   // TypeScript knows data.user is a valid user object
 *   console.log(data.user.name);
 * }
 * ```
 */
function isUser(
  user: unknown,
): user is Awaited<Route.ComponentProps["loaderData"]["user"]> {
  return (
    !!user &&
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    "name" in user &&
    "roles" in user
  );
}

/**
 * Hook to access the current user if one exists.
 * Returns undefined if no user is found in the root loader data.
 * This is the safe way to access user data when the user might not be logged in.
 *
 * @returns The current user object or undefined if no user exists
 *
 * @example
 * ```ts
 * const user = useOptionalUser();
 * if (user) {
 *   console.log(`Welcome ${user.name}`);
 * } else {
 *   console.log('Please sign in');
 * }
 * ```
 */
export function useOptionalUser() {
  const data = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root");

  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

/**
 * Hook to access the current user.
 * Throws an error if no user is found in the root loader data.
 * Use this hook when you're certain a user should be logged in.
 * For optional user access, use useOptionalUser() instead.
 *
 * @returns The current user object
 * @throws {Error} If no user is found in the root loader data
 *
 * @example
 * ```ts
 * // In a protected route component
 * const user = useUser();
 * // TypeScript knows user is defined
 * console.log(`Welcome ${user.name}`);
 *
 * // For optional user access:
 * const optionalUser = useOptionalUser();
 * if (optionalUser) {
 *   // Handle logged in user
 * }
 * ```
 */
export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}
