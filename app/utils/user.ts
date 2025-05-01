import type { Entity, Action, RoleName } from "~/generated/prisma/client";
import { useUser } from "~/hooks/user";

export type Access = "OWN" | "ANY" | "OWN,ANY" | "ANY,OWN";
export type PermissionString =
  | `${Action}:${Entity}`
  | `${Action}:${Entity}:${Access}`;

/**
 * Parse a permission string into its components
 * @param permissionString - permission string to parse
 * @returns { action, entity, access } - parsed permission string
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
 * Check if the user has a specific permission
 * @param user - user object from useUser
 * @param permission - permission string to check
 * @returns {boolean} - true if user has the permission, false otherwise
 * @example
 * ```ts
 * const user = useUser();
 * const hasPermission = userHasPermission(user, "CREATE:ARTICLE_COMMENT");
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
 * Check if the user has a specific role
 * @param user - user object from useUser
 * @param role - role name to check
 * @returns {boolean} - true if user has the role, false otherwise
 * @example
 * ```ts
 * const user = useUser();
 * const hasRole = userHasRole(user, "ADMIN");
 * ```
 */
export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, "roles"> | null,
  role: RoleName,
) {
  if (!user) return false;
  return user.roles.some((r) => r.name === role);
}
