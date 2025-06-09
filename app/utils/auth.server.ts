// import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import {
  type Connection,
  type Password,
  type Profile,
  // type Connection,
  type User,
} from "~/generated/prisma";
import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { safeRedirect } from "remix-utils/safe-redirect";
import { providers } from "./connection.server";
import { prisma } from "./db.server";
import { combineHeaders, combineResponseInits } from "./misc";
import { authSessionStorage } from "./session.server";
import type { ProviderUser } from "./providers/provider";
// import { type ProviderUser } from "./providers/provider";
// import { authSessionStorage } from "./session.server.ts";
// import { uploadProfileImage } from "./storage.server.ts";

export const SESSION_EXPIRATION_TIME = 14 * 24 * 60 * 60 * 1000; // 14 days
export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);

export const sessionKey = "sessionId";

export const authenticator = new Authenticator<ProviderUser>();

for (const [providerName, provider] of Object.entries(providers)) {
  const strategy = provider.getAuthStrategy();
  if (strategy) {
    authenticator.use(strategy, providerName);
  }
}

export async function getUserId(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const sessionId = authSession.get(sessionKey);
  if (!sessionId) return null;
  const session = await prisma.session.findUnique({
    select: { userId: true },
    where: { id: sessionId, expirationDate: { gt: new Date() } },
  });
  if (!session?.userId) {
    throw redirect("/", {
      headers: {
        "set-cookie": await authSessionStorage.destroySession(authSession),
      },
    });
  }
  return session.userId;
}

export async function requireUserId(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const userId = await getUserId(request);
  if (!userId) {
    const requestUrl = new URL(request.url);
    redirectTo =
      redirectTo === null
        ? null
        : (redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`);
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirect = ["/", loginParams?.toString()]
      .filter(Boolean)
      .join("?");
    throw redirect(loginRedirect);
  }
  return userId;
}

export async function requireUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const userId = await requireUserId(request, { redirectTo });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) {
    throw logout({ request });
  }
  return user;
}

export async function requireAnonymous(request: Request) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/");
  }
}

export async function signin({
  email,
  password,
}: {
  email: User["email"];
  password: string;
}) {
  const user = await verifyUserPassword({ email }, password);
  if (!user) return null;
  const session = await prisma.session.create({
    select: { id: true, expirationDate: true, userId: true },
    data: {
      expirationDate: getSessionExpirationDate(),
      userId: user.id,
    },
  });
  return session;
}

export async function signup({
  email,
  password,
  name,
}: {
  email: User["email"];
  name: Profile["name"];
  password: string;
}) {
  const hashedPassword = await getPasswordHash(password);

  const session = await prisma.session.create({
    data: {
      expirationDate: getSessionExpirationDate(),
      user: {
        create: {
          email: email.toLowerCase(),
          profile: {
            create: {
              name,
            },
          },
          roles: { connect: { name: "USER" } },
          password: {
            create: {
              hash: hashedPassword,
            },
          },
          notificationSettings: {
            create: {
              newContent: true,
            },
          },
        },
      },
    },
    select: { id: true, expirationDate: true },
  });
  return session;
}

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export async function verifyUserPassword(
  where: Pick<User, "email"> | Pick<User, "id">,
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where,
    select: { id: true, password: { select: { hash: true } } },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  return { id: userWithPassword.id };
}

export async function signupWithConnection({
  email,
  name,
  providerId,
  providerName,
  imageUrl,
}: {
  email: User["email"];
  name: Profile["name"];
  providerId: Connection["providerId"];
  providerName: Connection["providerName"];
  imageUrl?: string;
}) {
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      roles: { connect: { name: "USER" } },
      connections: { create: { providerId, providerName } },
      notificationSettings: {
        create: {
          newContent: true,
        },
      },
      profile: {
        create: {
          name: name,
          ...(imageUrl && { image: imageUrl }),
        },
      },
    },
    select: { id: true },
  });

  // Create and return the session
  const session = await prisma.session.create({
    data: {
      expirationDate: getSessionExpirationDate(),
      userId: user.id,
    },
    select: { id: true, expirationDate: true },
  });

  return session;
}

export async function logout(
  {
    request,
    redirectTo = "/",
  }: {
    request: Request;
    redirectTo?: string;
  },
  responseInit?: ResponseInit,
) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const sessionId = authSession.get(sessionKey);
  // if this fails, we still need to delete the session from the user's browser
  // and it doesn't do any harm staying in the db anyway.
  if (sessionId) {
    // the .catch is important because that's what triggers the query.
    // learn more about PrismaPromise: https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismapromise-behavior
    void prisma.session
      .deleteMany({ where: { id: sessionId } })
      .catch(() => {});
  }
  throw redirect(safeRedirect(redirectTo), {
    ...responseInit,
    headers: combineHeaders(
      { "set-cookie": await authSessionStorage.destroySession(authSession) },
      responseInit?.headers,
    ),
  });
}

export async function handleNewSession(
  {
    request,
    session,
    redirectTo,
    rememberMe = undefined,
  }: {
    request: Request;
    session: { userId: string; id: string; expirationDate: Date };
    redirectTo?: string;
    rememberMe?: "true" | undefined;
  },
  responseInit?: ResponseInit,
) {
  // if (await shouldRequestTwoFA({ request, userId: session.userId })) {
  //   const verifySession = await verifySessionStorage.getSession();
  //   verifySession.set(unverifiedSessionIdKey, session.id);
  //   verifySession.set(rememberKey, remember);
  //   const redirectUrl = getRedirectToUrl({
  //     request,
  //     type: twoFAVerificationType,
  //     target: session.userId,
  //   });
  //   return redirect(
  //     redirectUrl.toString(),
  //     combineResponseInits(
  //       {
  //         headers: {
  //           "set-cookie":
  //             await verifySessionStorage.commitSession(verifySession),
  //         },
  //       },
  //       responseInit,
  //     ),
  //   );
  // } else {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  authSession.set(sessionKey, session.id);

  return redirect(
    safeRedirect(redirectTo),
    combineResponseInits(
      {
        headers: {
          "set-cookie": await authSessionStorage.commitSession(authSession, {
            expires: rememberMe ? session.expirationDate : undefined,
          }),
        },
      },
      responseInit,
    ),
  );
  // }
}
