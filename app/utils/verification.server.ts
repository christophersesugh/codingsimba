import { createCookieSessionStorage, redirect } from "react-router";
import type { VerifyFunctionArgs } from "~/routes/verify";
import { invariant } from "./misc";
import { onboardingSessionKey } from "~/routes/onboarding";

export const verifySessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cs_verification",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});

export async function handleVerification({
  request,
  submission,
}: VerifyFunctionArgs) {
  invariant(submission.payload, "submission.payload should be defined by now");
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );
  verifySession.set(onboardingSessionKey, submission.payload.target);
  return redirect("/onboarding", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession),
    },
  });
}
