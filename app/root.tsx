import {
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
import { themeSessionResolver } from "./session.server";
import { GeneralErrorBoundary } from "./components/error-boundary";
import { AuthDialogProvider } from "./contexts/auth-dialog";
import { AuthDialog } from "./components/auth-dialog";
import { MobileNavProvider } from "./contexts/mobile-nav";
import { MobileNav } from "./components/mobile-nav";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: tailwindStyles },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return { theme: getTheme() };
}

type DocumentProps = {
  children: React.ReactNode;
  theme?: Theme | null;
  data?: Route.ComponentProps["loaderData"];
};

function Document({ children, theme, data }: DocumentProps) {
  return (
    <html lang="en" data-theme={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
        <Links />
      </head>
      <body className="min-h-screen">
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
    <Document theme={currentTheme} data={{ theme }}>
      <OptionalNavbar />
      <Outlet />
      <MobileNav />
      <AuthDialog />
      <Footer />
    </Document>
  );
}

export default function AppWithProviders() {
  const { theme } = useLoaderData() as Route.ComponentProps["loaderData"];
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
