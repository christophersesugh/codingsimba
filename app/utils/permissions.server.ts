import { data } from "react-router";
import { StatusCodes } from "http-status-codes";
import { prisma } from "./db.server";
import type { RoleName } from "~/generated/prisma/client";
import { type PermissionString, parsePermissionString } from "./permissions";
import { requireUserId } from "~/utils/auth.server";

/**
 * Requires a user to have a specific permission
 * @param {Request} request - The incoming request object
 * @param {PermissionString} permission - The permission string to check (e.g., "COMMENT:CREATE:OWN")
 * @returns {Promise<string>} The user's ID if they have the required permission
 * @throws {Response} Throws a 401 Unauthorized response if the user doesn't have the permission
 * @description Checks if the user has the specified permission through their roles.
 * The permission string is parsed to extract entity, action, and access type.
 * Throws an unauthorized error if the user doesn't have the required permission.
 */
export async function requireUserWithPermission(
  request: Request,
  permission: PermissionString,
) {
  const userId = await requireUserId(request);
  const permissionData = parsePermissionString(permission);
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: {
      id: userId,
      roles: {
        some: {
          permissions: {
            some: {
              ...permissionData,
              access: permissionData.access
                ? { in: permissionData.access }
                : undefined,
            },
          },
        },
      },
    },
  });
  if (!user) {
    throw data(
      {
        error: "Unauthorized",
        requiredPermission: permissionData,
        message: `Unauthorized: required permissions: ${permission}`,
      },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }
  return user.id;
}

/**
 * Requires a user to have a specific role
 * @param {Request} request - The incoming request object
 * @param {RoleName} name - The name of the role to check
 * @returns {Promise<string>} The user's ID if they have the required role
 * @throws {Response} Throws a 401 Unauthorized response if the user doesn't have the role
 * @description Checks if the user has the specified role.
 * Throws an unauthorized error if the user doesn't have the required role.
 */
export async function requireUserWithRole(request: Request, name: RoleName) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { id: userId, roles: { some: { name } } },
  });
  if (!user) {
    throw data(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`,
      },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }
  return user.id;
}
