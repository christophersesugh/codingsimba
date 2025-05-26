// import type { Route } from "./+types/verify";
// import { redirect } from "react-router";
// import { sessionKey, signin } from "~/utils/auth.server";
// import { verifySessionStorage } from "~/utils/verification.server";
// import { validateRedirectUrl } from "~/utils/misc";
// import { authSessionStorage } from "~/utils/session.server";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Button } from "~/components/ui/button";

// export const onboardingSessionKey = "onboardingEmail";

// export async function loader({ request }: Route.LoaderArgs) {
//   const verifySession = await verifySessionStorage.getSession(
//     request.headers.get("cookie"),
//   );
//   async function handleRedirectTo(request: Request) {
//     const url = new URL(request.url);
//     const redirectTo = url.searchParams.get("redirectTo");

//     const safePath = redirectTo
//       ? validateRedirectUrl(redirectTo, url.origin)
//       : null;

//     return safePath;
//   }

//   const email = verifySession.get(onboardingSessionKey);
//   if (typeof email !== "string" || !email) {
//     return redirect("/?status=error", {
//       headers: {
//         "Set-Cookie": await verifySessionStorage.destroySession(verifySession),
//       },
//     });
//   }
//   const session = await signin({ email } as { email: string });
//   const redirectTo = await handleRedirectTo(request);
//   const authSession = await authSessionStorage.getSession(
//     request.headers.get("cookie"),
//   );
//   authSession.set(sessionKey, session.id);

//   const isOnboarded = session.user.onboarded;

//   const redirectToPath = isOnboarded
//     ? redirectTo
//       ? redirectTo
//       : "/?status=success"
//     : `/onboarding?email=${email}${redirectTo ? `&${redirectTo}` : ""}`;

//   return redirect(redirectToPath, {
//     headers: {
//       "Set-Cookie": await authSessionStorage.commitSession(authSession),
//     },
//   });
// }

export default function VerifyPage() {
  const [otp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Email would typically come from a query parameter or auth state
  const userEmail = "user@example.com";

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success (in real app, check if OTP is correct)
      if (otp === "123456") {
        return;
      } else {
        setError("Invalid verification code. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setResendCooldown(60);
    setError("");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Show success message or handle resend logic
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900"
      >
        {/* Back button */}
        <button
          // onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
            {userEmail}
          </p>
        </div>

        {/* OTP Input */}
        <div className="mx-auto mb-6 flex w-full justify-center">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOtp}
          disabled={otp.length !== 6 || isVerifying}
          className="mb-6 w-full"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?
          </p>
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Resend code in {resendCooldown} seconds
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Resend verification code
            </button>
          )}
        </div>

        {/* Help text */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Check your spam folder if you don&apos;t see the email. The code
            expires in 10 minutes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
