import { styleText } from "node:util";
import { PrismaClient } from "~/generated/prisma";
import { singleton } from "./singleton.server";

export const prisma = singleton("prisma", () => {
  const logThreshold = 20;

  const client = new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });
  client.$on("query", async (e) => {
    if (e.duration < logThreshold) return;
    const color =
      e.duration < logThreshold * 1.1
        ? "green"
        : e.duration < logThreshold * 1.2
          ? "blue"
          : e.duration < logThreshold * 1.3
            ? "yellow"
            : e.duration < logThreshold * 1.4
              ? "redBright"
              : "red";
    const dur = styleText(color, `${e.duration}ms`);
    console.info(`prisma:query - ${dur} - ${e.query}`);
  });
  void client.$connect();
  return client;
});
