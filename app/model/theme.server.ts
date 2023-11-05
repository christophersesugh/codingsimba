import { createCookieSessionStorage } from "@remix-run/node";
import type { Theme } from "~/context/theme-context";
import { isTheme } from "~/context/theme-context";

const { SESSION_SECRET } = process.env;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET required.");
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "__cs_theme",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const cookie = await request.headers.get("Cookie");
  const session = await themeStorage.getSession(cookie);

  function getTheme() {
    const themeValue = session.get("theme");
    return isTheme(themeValue) ? themeValue : null;
  }

  function setTheme(theme: Theme) {
    return session.set("theme", theme);
  }

  function commit() {
    return themeStorage.commitSession(session);
  }
  return {
    getTheme,
    setTheme,
    commit,
  };
}

export { getThemeSession };
