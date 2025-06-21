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
import { sessionKey } from "./utils/auth.server";
import { Toaster } from "./components/ui/sonner";
import { getToast } from "./utils/toast.server";
import { combineHeaders } from "./utils/misc";
import { authSessionStorage } from "./utils/session.server";
import { getEnv } from "./utils/env.server";
import { useToast } from "./hooks/use-toast";

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

  const sessionId: string = authSession.get(sessionKey);
  const session = sessionId
    ? await prisma.session.findUnique({
        where: { id: sessionId },
        select: { userId: true },
      })
    : null;

  const user = session?.userId
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          email: true,
          name: true,
          isSubscribed: true,
          image: { select: { fileKey: true, altText: true } },
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

  const nullUser: boolean = !!(sessionId && !user);
  let headers = combineHeaders(toastHeaders);

  if (nullUser) {
    const destroyCookie = await authSessionStorage.destroySession(authSession);
    headers = combineHeaders(headers, { "set-cookie": destroyCookie });
  }

  return data(
    {
      toastSession,
      theme: getTheme(),
      env: getEnv(),
      user: !nullUser ? user : null,
    },
    { headers },
  );
}

type DocumentProps = {
  children: React.ReactNode;
  currentTheme?: Theme | null;
  theme?: Route.ComponentProps["loaderData"]["theme"];
  env?: Record<string, string | undefined>;
};

function Document({ children, currentTheme, theme, env }: DocumentProps) {
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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const [currentTheme] = useTheme();
  const { theme, toastSession, env } =
    useLoaderData() as Route.ComponentProps["loaderData"];
  useToast(toastSession);

  return (
    <Document currentTheme={currentTheme} theme={theme} env={env}>
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
