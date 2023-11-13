import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "~/libs/prisma.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET required.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "CS_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    return null;
  }
  return userId;
}

export async function requireUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    throw redirect(`/login`);
  }
  return userId;
}

export async function createUserSession(userId: number) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

type User = {
  email: string;
  password: string;
};

export async function register({ email, password }: User) {
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, hashPassword },
  });
  return { id: user.id, email, role: user.role };
}

export async function login({ email, password }: User) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.hashPassword);
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, email: user.email, role: user.role };
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, email: true, role: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function verifyUser(request: Request) {
  return getUser(request);
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
