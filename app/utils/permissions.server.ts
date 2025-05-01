import { data } from "react-router";
import { StatusCodes } from "http-status-codes";
import { requireUserId } from "./auth.server";
import { prisma } from "./db.server";
import type { RoleName } from "~/generated/prisma/client";
import { type PermissionString, parsePermissionString } from "./user";

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
