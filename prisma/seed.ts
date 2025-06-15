import { type Entity, type Action } from "../app/generated/prisma/client";
import { createPassword } from "tests/db-utils";
import { prisma } from "~/utils/db.server";

const { ADMIN_PASSWORD } = process.env;
const ADMIN_EMAIL = "me@codingsimba.com";

async function seed() {
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.user.deleteMany();

  const entities: Entity[] = ["USER", "COMMENT", "REPLY", "REVIEW", "PROFILE"];
  const actions: Action[] = ["CREATE", "READ", "UPDATE", "DELETE"];
  const accesses: string[] = ["OWN", "ANY"] as const;

  const permissions = [];
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        const permission = await prisma.permission.create({
          data: { entity, action, access },
        });
        permissions.push(permission);
      }
    }
  }

  const anyPermissions = permissions.filter((p) => p.access === "ANY");
  const ownPermissions = permissions.filter((p) => p.access === "OWN");

  await prisma.role.create({
    data: {
      name: "ADMIN",
      permissions: {
        connect: anyPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "MODERATOR",
      permissions: {
        connect: anyPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "USER",
      permissions: {
        connect: ownPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      isSubscribed: true,
      roles: {
        connect: [{ name: "ADMIN" }, { name: "MODERATOR" }, { name: "USER" }],
      },
      profile: {
        create: {
          name: "Christopher S. Aondona",
          image:
            "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/6749aa161e69b57e6d39b2cd430834da255e31bd-1024x1024.png",
        },
      },
      password: { create: createPassword(ADMIN_PASSWORD) },
      notificationSettings: {
        create: {
          contentUpdate: true,
        },
      },
    },
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
