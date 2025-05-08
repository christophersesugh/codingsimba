import React from "react";
import {
  data,
  Links,
  Meta,
  Outlet,
  // redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";

import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import type { Route } from "./+types/root";
import fontStyles from "~/styles/fonts.css?url";
import tailwindStyles from "~/styles/tailwind.css?url";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { themeSessionResolver } from "~/utils/theme.server";
import { GeneralErrorBoundary } from "./components/error-boundary";
import { AuthDialogProvider } from "./contexts/auth-dialog";
import { AuthDialog, AuthSchema } from "./components/auth-dialog";
import { MobileNavProvider } from "./contexts/mobile-nav";
import { MobileNav } from "./components/mobile-nav";
import { prisma } from "./utils/db.server";
import { authSessionStorage } from "./utils/session.server";
import { sessionKey, signin, signup } from "./utils/auth.server";
import { Toaster } from "./components/ui/sonner";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
// import { onboardingSessionKey } from "./routes/verify";

export const meta: Route.MetaFunction = () => [];

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: tailwindStyles },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);

  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie"),
  );

  const sessionId = authSession.get(sessionKey);
  const session = sessionId
    ? await prisma.session.findUnique({
        where: { id: sessionId },
      })
    : null;

  const user = session?.userId
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              name: true,
              image: true,
              bio: true,
              location: true,
              website: true,
              github: true,
            },
          },
          roles: {
            select: {
              name: true,
              permissions: {
                select: { access: true, action: true, entity: true },
              },
            },
          },
        },
      })
    : null;

  const dataObj = { user, theme: getTheme() } as const;
  /**
   * 😜 Maybe a user is deleted in DB 🤷🏽‍♂️
   * If we can't find the user in DB, we need to remove the userId from the cookie
   * session and return null user.
   * This will prevent the user from being logged in and will automatically log them out
   */
  if (sessionId && !user) {
    return data({ ...dataObj, user: null } as const, {
      headers: {
        "Set-Cookie": await authSessionStorage.destroySession(authSession),
      },
    });
  }

  return dataObj;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: AuthSchema.transform(async (data, ctx) => {
      const { authType, email, password, intent } = data;
      if (intent !== "submit" || !authType) return { ...data, session: null };

      switch (authType) {
        case "signup": {
          const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
          });

          if (existingUser) {
            ctx.addIssue({
              path: ["email"],
              code: z.ZodIssueCode.custom,
              message: "Email already in use.",
            });
            return z.NEVER;
          }

          const session = await signup({
            email,
            name: name ?? null,
            password,
          });

          return { ...data, session };
        }

        case "signin": {
          const session = await signin({ email, password });
          if (!session) {
            ctx.addIssue({
              path: ["root"],
              code: z.ZodIssueCode.custom,
              message: "Invalid credentials.",
            });
            return z.NEVER;
          }
          return { ...data, session };
        }

        default:
          throw new Error("Invalid authType");
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return data({ status: "error", ...submission.reply() } as const, {
      status:
        submission.status === "error"
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.OK,
    });
  }

  if (!submission.value.session) {
    return data({ status: "error", ...submission.reply() } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const { rememberMe, session, authType } = submission.value;

  if (authType === "signin") {
    const authSession = await authSessionStorage.getSession(
      request.headers.get("cookie"),
    );

    authSession.set(sessionKey, session.id);

    return data({ status: "success", ...submission.reply() } as const, {
      headers: {
        "Set-Cookie": await authSessionStorage.commitSession(authSession, {
          expires: rememberMe ? session.expirationDate : undefined,
        }),
      },
    });
  } else {
    // const verifySession = await verifySessionStorage.getSession(
    //   request.headers.get("cookie"),
    // );

    // verifySession.set(onboardingSessionKey, email);

    // const { verifyUrl, redirectTo, otp } = await prepareVerification({
    //   period: 10 * 60,
    //   request,
    //   type: "onboarding",
    //   target: email,
    // });

    // const response = await sendEmail({
    //   to: email,
    //   subject: `Welcome to Epic Notes!`,
    //   react: <SignupEmail onboardingUrl={verifyUrl.toString()} otp={otp} />,
    // });

    // const emailResponse = await sendEmail({
    //   to: email,
    //   subject: "Sign in to Coding Simba",
    //   react: <SigninEmail signinUrl={`${getDomainUrl(request)}/verify`} />,
    // });

    // if (response.status === "success") {
    //   return redirect(redirectTo.toString());
    // } else {
    //   return data(
    //     { ...submission.reply({ formErrors: [response.error] }) },
    //     { status: StatusCodes.INTERNAL_SERVER_ERROR },
    //   );
    // }
    return {};
  }
}

type DocumentProps = {
  children: React.ReactNode;
  currentTheme?: Theme | null;
  theme?: Route.ComponentProps["loaderData"]["theme"];
};

function Document({ children, currentTheme, theme }: DocumentProps) {
  return (
    <html lang="en" data-theme={currentTheme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={!!theme} />
        <Links />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const [currentTheme] = useTheme();
  const { theme } = useLoaderData() as Route.ComponentProps["loaderData"];

  return (
    <Document currentTheme={currentTheme} theme={theme}>
      <OptionalNavbar />
      <MobileNav />
      <Outlet />
      <Toaster />
      <AuthDialog />
      <Footer />
    </Document>
  );
}

function OptionalNavbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return isHomePage ? null : <Navbar />;
}

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
  const { theme } = loaderData;

  return (
    <ThemedApp theme={theme}>
      <AuthDialogProvider>
        <MobileNavProvider>
          <App />
        </MobileNavProvider>
      </AuthDialogProvider>
    </ThemedApp>
  );
}

function ThemedApp({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme | null;
}) {
  return (
    <ThemeProvider
      specifiedTheme={theme}
      themeAction="/set-theme"
      disableTransitionOnThemeChange={true}
    >
      {children}
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  return (
    <ThemedApp theme={null}>
      <Document>
        <GeneralErrorBoundary />
      </Document>
    </ThemedApp>
  );
}
