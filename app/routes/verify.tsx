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

// export default function VerifyRoute({ loaderData }: Route.ComponentProps) {
//   const { status, user, redirectTo } = loaderData;
//   const [countdown, setCountdown] = React.useState(4);
//   const navigate = useNavigate();

//   const isOnboarded = user?.onboarded;

//   const onboardingParams = new URLSearchParams({
//     email: user?.email ?? "",
//     ...(redirectTo?.path && { redirectTo: redirectTo.path }),
//   });

//   const redirectToPath = isOnboarded
//     ? (redirectTo?.path ?? "/")
//     : `/onboarding?${onboardingParams.toString()}`;

//   const redirectToPathname = isOnboarded
//     ? (redirectTo?.pathname ?? "home")
//     : "onboarding";

//   useInterval(() => {
//     const MIN = 1;
//     setCountdown((prev) => {
//       if (prev <= MIN) {
//         if (status === "success") {
//           navigate(redirectToPath, { state: { user }, replace: true });
//         } else {
//           navigate(redirectTo.path, { replace: true });
//         }
//         return 0;
//       }
//       return prev - MIN;
//     });
//   }, 1000);

//   const isSuccess = status === "success";

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
//         <div className="mb-8 text-center">
//           <div className="mb-4 flex justify-center">
//             <div
//               className={cn(
//                 "flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30",
//                 {
//                   "bg-red-100": !isSuccess,
//                 },
//               )}
//             >
//               {isSuccess ? (
//                 <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
//               ) : (
//                 <CircleAlert className="size-8 text-red-600 dark:text-red-400" />
//               )}
//             </div>
//           </div>
//           {isSuccess ? (
//             <>
//               <h1 className="mb-2 text-2xl font-bold">
//                 You&apos;re signed in!
//               </h1>
//               <p className="mb-2 text-gray-600 dark:text-gray-300">
//                 Welcome back, <span className="font-medium">{user?.email}</span>
//               </p>
//             </>
//           ) : (
//             <p className="mb-2 text-red-600 dark:text-red-300">
//               Invalid sign-in link, try again.
//             </p>
//           )}
//           <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
//             <span>Redirecting to {redirectToPathname} in </span>
//             <span className="mx-2 flex size-6 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
//               {countdown}
//             </span>
//             <span>seconds...</span>
//           </div>
//         </div>

//         <div className="flex justify-center">
//           <Button
//             onClick={() =>
//               navigate(isSuccess ? redirectToPath : redirectTo.path, {
//                 replace: true,
//               })
//             }
//             className="w-full"
//           >
//             Continue Now
//             <ArrowRight className="ml-2 size-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
