/**
 * This function creates a singleton value that is only initialized once.
 * It uses a global object to store the value, so it can be accessed from anywhere in the application.
 * This is useful for values that are expensive to create or that need to be shared across multiple parts of the application.
 * @param name - The name of the singleton
 * @param value - A function that returns the value of the singleton
 * @returns {Value} - The value of the singleton
 * @example
 * ```ts
 * import { PrismaClient } from "@prisma/client";
 * import { singleton } from "./singleton.server";
 * const db = singleton("prisma", () => new PrismaClient());
 * ```
 */
export function singleton<Value>(name: string, value: () => Value): Value {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yolo = global as any;
  yolo.__singletons ??= {};
  yolo.__singletons[name] ??= value();
  return yolo.__singletons[name];
}
