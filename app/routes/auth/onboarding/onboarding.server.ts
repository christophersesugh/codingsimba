import { redirect } from "react-router";
import { invariant } from "~/utils/misc";
import type { VerifyFunctionArgs } from "../verify.server";
import { verifySessionStorage } from "~/utils/verification.server";
import { onboardingSessionKey } from ".";

export async function handleVerification({ submission }: VerifyFunctionArgs) {
  invariant(
    submission.status === "success",
    "Submission should be successful by now",
  );
  const verifySession = await verifySessionStorage.getSession();
  verifySession.set(onboardingSessionKey, submission.value.target);
  return redirect("/onboarding", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession),
    },
  });
}
