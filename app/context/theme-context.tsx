import React from "react";
import { useFetcher } from "@remix-run/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

type ThemeContextType = [
  Theme | null,
  Dispatch<SetStateAction<Theme | null>>,
  toggleTheme: () => void,
];

const prefersDarkMQ = "(prefers-color-scheme: dark)";
const getPreferredTheme = () =>
  window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT;

const themes: Array<Theme> = Object.values(Theme);

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

function ThemeProvider({
  children,
  sTheme,
}: {
  children: ReactNode;
  sTheme: Theme | null;
}) {
  const [theme, setTheme] = React.useState<Theme | null>(() => {
    if (sTheme) {
      if (themes.includes(sTheme)) {
        return sTheme;
      } else {
        return null;
      }
    }
    if (typeof window === "undefined") {
      return null;
    }

    return getPreferredTheme();
  });
  const persistTheme = useFetcher();
  const mountRun = React.useRef(false);
  const persistThemeRef = React.useRef(persistTheme);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ);
    const handleChange = () => {
      setTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // TODO: remove this when persistTheme is memoized properly
  React.useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  React.useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) {
      return;
    }

    persistThemeRef.current.submit(
      { theme },
      { action: "theme", method: "post" },
    );
  }, [theme]);

  function toggleTheme() {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  }

  return (
    <ThemeContext.Provider value={[theme, setTheme, toggleTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
    ? 'dark'
    : 'light';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (themeAlreadyApplied) {
    // this script shouldn't exist if the theme is already applied!
    console.warn(
      "Hi there, could you let Matt know you're seeing this message? Thanks!",
    );
  } else {
    cl.add(theme);
  }

  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  } else {
    console.warn(
      "Hey, could you let Matt know you're seeing this message? Thanks!",
    );
  }
})();
`;

function RemoveThemeFlashes({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme();
  return (
    <>
      <meta
        name="color-scheme"
        content={theme === "light" ? "light dark" : "dark light"}
      />
      {ssrTheme ? null : (
        <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
      )}
    </>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { Theme, ThemeProvider, useTheme, RemoveThemeFlashes, isTheme };
