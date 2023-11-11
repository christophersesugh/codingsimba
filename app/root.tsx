import type { PropsWithChildren } from "react";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  // MetaFunction,
} from "@remix-run/node";
import type { Theme } from "~/context/theme-context";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import tailwind from "~/tailwind.css";
import markdown from "~/markdown.css";
import markdownEditor from "~/markdown-editor.css";
import {
  useTheme,
  ThemeProvider,
  RemoveThemeFlashes,
} from "~/context/theme-context";
import { RootLayout } from "~/components/layout";
import { ErrorUI } from "~/components/error-ui";
import { getThemeSession } from "~/model/theme.server";
// import { metaData } from "~/utils/meta";

export async function loader({ request }: LoaderFunctionArgs) {
  const themeSession = await getThemeSession(request);
  const data = {
    theme: themeSession.getTheme(),
  };
  return data;
}

// export const meta: MetaFunction = metaData({
//   title: "Home",
// });

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
    href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&family=Mulish&family=Roboto&display=swap",
  },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: markdown },
  { rel: "stylesheet", href: markdownEditor },
];

function Document({
  children,
  theme,
  headData,
}: PropsWithChildren<{ headData?: any; theme?: Theme | null }>) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {headData}
      </head>
      <body
        className={clsx(
          "bg-[#fff] text-[#1f2028] dark:bg-[#1f2028] dark:text-[#fff] transition-all duration-300 min-w-[100vw] min-h-[100vh]",
          isLoading && "opacity-40",
        )}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ThemeApp({ children }: PropsWithChildren) {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <Document
      headData={<RemoveThemeFlashes ssrTheme={Boolean(data.theme)} />}
      theme={theme}
    >
      {children}
    </Document>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider sTheme={data.theme}>
      <ThemeApp>
        <RootLayout />
      </ThemeApp>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Document>
      <ErrorUI error={error} />
    </Document>
  );
}
