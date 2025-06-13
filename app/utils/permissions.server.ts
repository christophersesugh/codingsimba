import { data } from "react-router";
import { StatusCodes } from "http-status-codes";
import { prisma } from "./db.server";
import type { Comment, RoleName } from "~/generated/prisma/client";
import { type PermissionString, parsePermissionString } from "./permissions";
import type { Entity } from "~/generated/prisma/enums";
import type { IComment } from "~/components/comment";
import { requireUserId } from "~/routes/auth/auh.server";

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

/**
 * Determines permissions for comments and replies
 * @param {Object} params - The parameters for determining permissions
 * @param {string} params.userId - The ID of the user to check permissions for
 * @param {Entity} params.entity - The type of entity (e.g., "COMMENT")
 * @param {Array<Comment | IComment>} params.entityArray - Array of comments or replies to check permissions for
 * @returns {Promise<Array<{commentId: string, isOwner: boolean, permissions: Array<{action: string, hasPermission: boolean}>}>>} Array of permission objects containing commentId, isOwner, and permissions array
 * @description Checks both ownership and role-based permissions for each entity.
 * For owners, checks both OWN and ANY access types.
 * For non-owners, only checks ANY access type.
 * Returns an array of permission objects with:
 * - commentId: The ID of the comment/reply
 * - isOwner: Whether the user owns the entity
 * - permissions: Array of permission objects with action and hasPermission
 */
export async function determinePermissions({
  userId,
  entity,
  entityArray,
}: {
  userId: string;
  entity: Entity;
  entityArray: (Comment | IComment)[];
}) {
  if (!userId || !entityArray?.length) {
    return [];
  }
  return Promise.all(
    entityArray.map(async (item) => {
      const isOwner = item.authorId === userId;
      const permissions = await prisma.permission.findMany({
        select: { id: true, action: true },
        where: {
          entity,
          roles: { some: { users: { some: { id: userId } } } },
          action: {
            in: ["CREATE", "READ", "UPDATE", "DELETE"],
          },
          access: isOwner ? "OWN" : "ANY",
        },
      });
      return {
        commentId: item.id,
        isOwner,
        permissions: permissions.map((p) => ({
          action: p.action,
          hasPermission: true,
        })),
      };
    }),
  );
}
