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
import { SidebarProvider } from "./contexts/sidebar";
import { Sidebar } from "./components/sidebar";

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
  const location = useLocation();
  const { theme } = useLoaderData() as Route.ComponentProps["loaderData"];

  const isHomePage = location.pathname === "/";

  return (
    <Document theme={currentTheme} data={{ theme }}>
      <div className={isHomePage ? "hidden" : ""}>
        <Navbar />
      </div>
      <Outlet />
      <Sidebar />
      <AuthDialog />
      <Footer />
    </Document>
  );
}

export default function AppWithProviders() {
  const { theme } = useLoaderData() as Route.ComponentProps["loaderData"];
  return (
    <ThemeProvider
      specifiedTheme={theme}
      themeAction="/set-theme"
      disableTransitionOnThemeChange={true}
    >
      <AuthDialogProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </AuthDialogProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  );
}
