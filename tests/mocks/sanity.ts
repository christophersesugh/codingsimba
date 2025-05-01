import { http, passthrough, type HttpHandler } from "msw";

/**
 * We don't want to mock the sanity client in tests, so we use the
 * passthrough handler to let the request go through to the real
 * server.
 */
export const handlers: HttpHandler[] = [
  http.get(/https:\/\/3alj5od9\.apicdn\.sanity\.io\/.*/, passthrough),
];
