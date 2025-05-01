import { createCookieSessionStorage } from "react-router";

export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cs_session",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
    secrets: process.env.SESSION_SECRET.split(","),
    ...(process.env.NODE_ENV === "production"
      ? {
          domain: "codingsimba.com",
          secure: true,
        }
      : {}),
  },
});
