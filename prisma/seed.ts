import { PrismaClient } from "../app/generated/prisma/client";
import { type Entity, type Action } from "../app/generated/prisma/client";
import { createPassword } from "tests/db-utils";

const prisma = new PrismaClient();

async function seed() {
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.user.deleteMany();

  const entities: Entity[] = ["USER", "COMMENT", "REVIEW", "SETTINGS"];
  const actions: Action[] = ["CREATE", "READ", "UPDATE", "DELETE"];
  const accesses: string[] = ["OWN", "ANY"] as const;

  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await prisma.permission.create({
          data: { entity, action, access },
        });
      }
    }
  }

  await prisma.role.create({
    data: {
      name: "ADMIN",
      permissions: {
        connect: await prisma.permission.findMany({
          where: { access: "ANY" },
        }),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "USER",
      permissions: {
        connect: await prisma.permission.findMany({
          where: { access: "OWN" },
        }),
      },
    },
  });

  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL,
      roles: { connect: [{ name: "ADMIN" }, { name: "USER" }] },
      profile: {
        create: {
          name: "Christopher S. Aondona",
          image: "https://loremflickr.com/1540/994?lock=4824176450717785",
        },
      },
      password: { create: createPassword(process.env.ADMIN_PASSWORD) },
      notificationSettings: {
        create: {
          newContent: true,
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
  });
