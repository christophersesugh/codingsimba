import { createCookieSessionStorage, redirect } from "react-router";
import { createId as cuid } from "@paralleldrive/cuid2";
import { combineHeaders } from "./misc";
import { z } from "zod";

const toastKey = "toast";

const TypeSchema = z.enum(["message", "info", "success", "warning", "error"]);
const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => cuid()),
  title: z.string().optional(),
  type: TypeSchema.default("message"),
});

export type Toast = z.infer<typeof ToastSchema>;
export type OptionalToast = Omit<Toast, "id" | "type"> & {
  id?: string;
  type?: z.infer<typeof TypeSchema>;
};

export const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__cs_toast",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});

export async function redirectWithToast(
  url: string,
  toast: OptionalToast,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
  });
}

export async function createToastHeaders(optionalToast: OptionalToast) {
  const session = await toastSessionStorage.getSession();
  const toast = ToastSchema.parse(optionalToast);
  session.flash(toastKey, toast);
  const cookie = await toastSessionStorage.commitSession(session);
  return new Headers({ "set-cookie": cookie });
}

export async function getToast(request: Request) {
  const session = await toastSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const result = ToastSchema.safeParse(session.get(toastKey));
  const toast = result.success ? result.data : null;
  return {
    toast,
    headers: toast
      ? new Headers({
          "set-cookie": await toastSessionStorage.destroySession(session),
        })
      : null,
  };
}
