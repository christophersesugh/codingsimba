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

import type { Route } from "./+types/root";
import fontStyles from "~/styles/fonts.css?url";
import tailwindStyles from "~/styles/tailwind.css?url";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { themeSessionResolver } from "~/utils/theme.server";
import { GeneralErrorBoundary } from "./components/error-boundary";
import { MobileNavProvider } from "./contexts/mobile-nav";
import { MobileNav } from "./components/mobile-nav";
import { prisma } from "./utils/db.server";
import { authSessionStorage } from "./utils/session.server";
import { sessionKey } from "./utils/auth.server";
import { Toaster } from "./components/ui/sonner";
import { getToast } from "./utils/toast.server";
import { combineHeaders } from "./utils/misc";
import { toast } from "sonner";

// export const meta: Route.MetaFunction = () => [];

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: tailwindStyles },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const { toast: toastSession, headers: toastHeaders } =
    await getToast(request);

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
          isSubscribed: true,
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

  const dataObj = { user, toastSession, theme: getTheme() };

  /**
   * 😜 Maybe a user is deleted in DB 🤷🏽‍♂️
   * If we can't find the user in DB, we need to remove the userId from the cookie
   * session and return null user.
   * This will prevent the user from being logged in and will automatically log them out
   */
  if (sessionId && !user) {
    return data(
      { ...dataObj, user: null },
      {
        headers: combineHeaders(
          {
            "set-cookie": await authSessionStorage.destroySession(authSession),
          },
          toastHeaders,
        ),
      },
    );
  }

  return data(dataObj, {
    headers: combineHeaders(
      // csrfCookieHeader ? { "set-cookie": csrfCookieHeader } : null,
      toastHeaders,
    ),
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
  const { theme, toastSession } =
    useLoaderData() as Route.ComponentProps["loaderData"];

  React.useEffect(() => {
    if (toastSession) {
      toast[toastSession.type](toastSession.title, {
        id: toastSession.id,
        description: toastSession.description,
      });
    }
  }, [toastSession]);

  return (
    <Document currentTheme={currentTheme} theme={theme}>
      <OptionalNavbar />
      <MobileNav />
      <Outlet />
      <Footer />
      <Toaster position="top-center" richColors />
    </Document>
  );
}

function OptionalNavbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return !isHomePage ? <Navbar /> : null;
}

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
  const { theme } = loaderData;

  return (
    <ThemedApp theme={theme}>
      <MobileNavProvider>
        <App />
      </MobileNavProvider>
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
