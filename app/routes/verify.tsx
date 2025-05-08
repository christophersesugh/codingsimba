import type { Route } from "./+types/verify";
import { redirect } from "react-router";
import { sessionKey, signin } from "~/utils/auth.server";
import { verifySessionStorage } from "~/utils/verification.server";
import { validateRedirectUrl } from "~/utils/misc";
import { authSessionStorage } from "~/utils/session.server";

export const onboardingSessionKey = "onboardingEmail";

export async function loader({ request }: Route.LoaderArgs) {
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );
  async function handleRedirectTo(request: Request) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo");

    const safePath = redirectTo
      ? validateRedirectUrl(redirectTo, url.origin)
      : null;

    return safePath;
  }

  const email = verifySession.get(onboardingSessionKey);
  if (typeof email !== "string" || !email) {
    return redirect("/?status=error", {
      headers: {
        "Set-Cookie": await verifySessionStorage.destroySession(verifySession),
      },
    });
  }
  const session = await signin({ email } as { email: string });
  const redirectTo = await handleRedirectTo(request);
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  authSession.set(sessionKey, session.id);

  const isOnboarded = session.user.onboarded;

  const redirectToPath = isOnboarded
    ? redirectTo
      ? redirectTo
      : "/?status=success"
    : `/onboarding?email=${email}${redirectTo ? `&${redirectTo}` : ""}`;

  return redirect(redirectToPath, {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(authSession),
    },
  });
}
