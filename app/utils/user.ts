import type { Entity, Action, RoleName } from "~/generated/prisma/client";
import { useUser } from "~/hooks/user";

export type Access = "OWN" | "ANY" | "OWN,ANY" | "ANY,OWN";
export type PermissionString =
  | `${Action}:${Entity}`
  | `${Action}:${Entity}:${Access}`;

/**
 * Parses a permission string into its components (action, entity, and access level).
 * Handles both simple and complex permission strings.
 *
 * @param permissionString - The permission string to parse (e.g., "CREATE:ARTICLE_COMMENT:OWN,ANY")
 * @returns Object containing parsed components
 * @returns {Action} action - The action component (e.g., "CREATE")
 * @returns {Entity} entity - The entity component (e.g., "ARTICLE_COMMENT")
 * @returns {Access[] | undefined} access - Array of access levels or undefined if not specified
 *
 * @example
 * ```ts
 * const permissionString = "CREATE:ARTICLE_COMMENT:OWN,ANY";
 * const { action, entity, access } = parsePermissionString(permissionString);
 * // action = "CREATE"
 * // entity = "ARTICLE_COMMENT"
 * // access = ["OWN", "ANY"]
 * ```
 */
export function parsePermissionString(permissionString: PermissionString) {
  const [action, entity, access] = permissionString.split(":") as [
    Action,
    Entity,
    Access | undefined,
  ];
  return {
    action,
    entity,
    access: access ? (access.split(",") as Access[]) : undefined,
  };
}

/**
 * Checks if a user has a specific permission.
 * Validates against the user's roles and their associated permissions.
 *
 * @param user - The user object from useUser hook
 * @param permission - The permission string to check (e.g., "CREATE:ARTICLE_COMMENT:OWN")
 * @returns True if the user has the specified permission, false otherwise
 *
 * @example
 * ```ts
 * const user = useUser();
 * const canCreateComment = userHasPermission(user, "CREATE:ARTICLE_COMMENT");
 * if (canCreateComment) {
 *   // User can create comments
 * }
 * ```
 */
export function userHasPermission(
  user: Pick<ReturnType<typeof useUser>, "roles"> | null | undefined,
  permission: PermissionString,
) {
  if (!user) return false;
  const { action, entity, access } = parsePermissionString(permission);
  return user.roles.some((role) =>
    role.permissions.some(
      (permission) =>
        permission.entity === entity &&
        permission.action === action &&
        (!access || access.includes(permission.access as Access)),
    ),
  );
}

/**
 * Checks if a user has a specific role.
 * Validates against the user's assigned roles.
 *
 * @param user - The user object from useUser hook
 * @param role - The role name to check (e.g., "ADMIN")
 * @returns True if the user has the specified role, false otherwise
 *
 * @example
 * ```ts
 * const user = useUser();
 * const isAdmin = userHasRole(user, "ADMIN");
 * if (isAdmin) {
 *   // User has admin privileges
 * }
 * ```
 */
export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, "roles"> | null,
  role: RoleName,
) {
  if (!user) return false;
  return user.roles.some((r) => r.name === role);
}

/**
 * Generates initials from a person's name.
 * Handles various name formats and edge cases.
 *
 * @param name - The full name to generate initials from
 * @returns A string containing the initials (e.g., "JD" for "John Doe")
 *
 * @example
 * ```ts
 * const initials = getInitials("John Doe"); // "JD"
 * const singleName = getInitials("John"); // "J"
 * const withMiddle = getInitials("John A. Doe"); // "JD"
 * ```
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "";

  const words = name
    .split(/\s+/)
    .filter(
      (word) => word.length > 0 && !(word.length === 2 && word.endsWith(".")),
    );

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

/**
 * Capitalizes each word in a name string.
 * Handles multiple spaces and preserves existing capitalization patterns.
 *
 * @param name - The name string to capitalize
 * @returns The capitalized name string
 *
 * @example
 * ```ts
 * const name = capitalizeName("john doe"); // "John Doe"
 * const complex = capitalizeName("mary-jane O'connor"); // "Mary-Jane O'Connor"
 * ```
 */
export function capitalizeName(name: string) {
  return name
    .trim()
    .replace(
      /\b\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
}
