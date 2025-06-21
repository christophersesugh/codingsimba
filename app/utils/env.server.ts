import { z } from "zod";

export const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"] as const),
  SESSION_SECRET: z.string(),
  ADMIN_PASSWORD: z.string(),
  POLAR_ACCESS_TOKEN: z.string(),
  POLAR_WEBHOOK_SECRET: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  DATABASE_URL: z.string().default("file:./dev.db"),
  BUNNY_STORAGE_ZONE: z.string(),
  BUNNY_ACCESS_KEY: z.string(),
  BUNNY_LIBRARY_ID: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  SANITY_STUDIO_PROJECT_ID: z.string(),
  SANITY_STUDIO_DATASET: z.string(),
  ALLOW_INDEXING: z.enum(["true", "false"]).optional(),
});

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );

    throw new Error("Invalid environment variables");
  }
}

export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    LIBRARY_ID: process.env.BUNNY_LIBRARY_ID,
    ALLOW_INDEXING: process.env.ALLOW_INDEXING,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  // eslint-disable-next-line no-var
  var env: ENV;
  interface Window {
    env: ENV;
  }
}
