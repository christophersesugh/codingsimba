import closeWithGrace from "close-with-grace";
import { passthrough, http, type HttpHandler } from "msw";
import { setupServer } from "msw/node";
import { handlers as sanityHandlers } from "./sanity";
import { handlers as resendHandlers } from "./resend";
import { handlers as bunnyHandlers } from "./bunny";
import { handlers as githubHandlers } from "./github";

const miscHandlers: HttpHandler[] = process.env.REACTR_ROUTER_DEV_ORIGIN
  ? [http.post(`${process.env.REACTR_ROUTER_DEV_ORIGIN}ping`, passthrough)]
  : [];

export const server = setupServer(
  ...miscHandlers,
  ...resendHandlers,
  ...bunnyHandlers,
  ...sanityHandlers,
  ...githubHandlers,
);

server.listen({ onUnhandledRequest: "warn" });
console.info("🔶 Mock server installed");

closeWithGrace(() => {
  server.close();
});
