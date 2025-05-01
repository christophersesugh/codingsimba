import React from "react";
import {
  data,
  Links,
  Meta,
  Outlet,
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

import { parseWithZod } from "@conform-to/zod";

import type { Route } from "./+types/root";
import fontStyles from "~/styles/fonts.css?url";
import tailwindStyles from "~/styles/tailwind.css?url";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { themeSessionResolver } from "~/utils/theme.server";
import { GeneralErrorBoundary } from "./components/error-boundary";
import { AuthDialogProvider } from "./contexts/auth-dialog";
import { AuthDialog, authSchema } from "./components/auth-dialog";
import { MobileNavProvider } from "./contexts/mobile-nav";
import { MobileNav } from "./components/mobile-nav";
import { prisma } from "./utils/db.server";
import { authSessionStorage } from "./utils/session.server";
import { StatusCodes } from "http-status-codes";
import { verifySessionStorage } from "./utils/verification.server";
import { sendEmail } from "./services.server/email";
import { getDomainUrl } from "./utils/misc";
import { SigninEmail } from "./email-templates/signin";
import { onboardingSessionKey } from "./routes/verify";
import { sessionKey } from "./utils/auth.server";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

export const meta: Route.MetaFunction = () => [];

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: tailwindStyles },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);

  const status = new URL(request.url).searchParams.get("status") as
    | "success"
    | "error"
    | null;
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

  const dataObj = { status, user, theme: getTheme() } as const;
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
  const submission = parseWithZod(formData, { schema: authSchema });

  if (submission.status !== "success") {
    return {
      ...submission.reply(),
      user: null,
    };
  }

  if (!submission.value || submission.value.intent !== "submit") {
    throw data(
      { status: "error", submission },
      { status: StatusCodes.BAD_REQUEST, statusText: "Bad Request" },
    );
  }

  const { email, redirectTo } = submission.value;

  const signinUrl = `${getDomainUrl(request)}/verify${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`;

  const emailResponse = await sendEmail({
    to: email,
    subject: "Sign in to Coding Simba",
    react: <SigninEmail signinUrl={signinUrl} />,
  });

  if (emailResponse.status === "error") {
    return data({ status: "error", submission } as const, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: emailResponse.error,
    });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie"),
  );
  verifySession.set(onboardingSessionKey, email);

  return data({ status: "success", submission } as const, {
    headers: {
      "Set-Cookie": await verifySessionStorage.commitSession(verifySession),
    },
  });
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

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
  const { status, user, theme } = loaderData;

  React.useEffect(() => {
    if (status === "success") {
      toast("You're signed in!");
    } else if (status === "error") {
      toast("Expired sign-in link, try again");
    }
  }, [status, user?.email]);

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

function OptionalNavbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return isHomePage ? null : <Navbar />;
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
