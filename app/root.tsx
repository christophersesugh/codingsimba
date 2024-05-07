import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/remix";
import tailwind from "./tailwind.css";
import dark from "highlight.js/styles/night-owl.css";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/server-runtime";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { themeSessionResolver } from "./utils/session.server";
import { cn } from "./utils/shadcn";
import { RootLayout } from "./components/layout";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/icon.png",
    type: "image/png",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap",
  },
  {
    rel: "stylesheet",
    href: tailwind,
  },
  {
    rel: "stylesheet",
    href: dark,
  },
];
export default function AppWithTheme() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <html lang="en" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msvalidate.01" content="471697018F51A070DE0EAA3B6E96851E" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body
        className={cn(
          "bg-[#fff] text-[#1f2028] dark:bg-[#1f2028] dark:text-[#fff] transition-all duration-300 min-w-[100vw] min-h-[100vh]",
          {
            "opacity-40": isLoading,
          }
        )}
      >
        <RootLayout />
        <SpeedInsights />
        <Analytics />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {}
