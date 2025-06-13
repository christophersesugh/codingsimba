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
