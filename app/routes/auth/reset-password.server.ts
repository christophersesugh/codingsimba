import { data, redirect } from "react-router";
import { invariant } from "~/utils/misc";
import type { VerifyFunctionArgs } from "./verify";
import { prisma } from "~/utils/db.server";
import { verifySessionStorage } from "~/utils/verification.server";
import { resetPasswordEmailSessionKey } from "./forgot-password";
import { StatusCodes } from "http-status-codes";

export async function handleVerification({ submission }: VerifyFunctionArgs) {
  invariant(
    submission.status === "success",
    "Submission should be successful by now",
  );
  const target = submission.value.target;
  const user = await prisma.user.findFirst({
    where: { email: target },
    select: { email: true },
  });
  if (!user) {
    return data(
      { ...submission.reply({ fieldErrors: { code: ["Invalid code"] } }) },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const verifySession = await verifySessionStorage.getSession();
  verifySession.set(resetPasswordEmailSessionKey, user.email);
  return redirect("/auth/reset-password", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession),
    },
  });
}
