import { createCookieSessionStorage } from "react-router";

export const verifySessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cs_verification",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});
