import { http, HttpHandler, HttpResponse } from "msw";
import { StatusCodes } from "http-status-codes";
import { SANITY_API_URL } from "~/utils/content.server/loader";
import { articleQueryHandler } from "./article";
import { authorQueryHandler } from "./author";
import { tutorialQueryHandler } from "./tutorial";

const allHandlers = [
  ...articleQueryHandler,
  ...authorQueryHandler,
  ...tutorialQueryHandler,
];

/**
 * Main HTTP handler for Sanity API requests
 * Routes GROQ queries to appropriate handlers and returns responses
 */
export const handlers: HttpHandler[] = [
  http.get(SANITY_API_URL, async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) {
      return HttpResponse.json(
        { error: "Query parameter is required" },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    console.log("🔍 Sanity handler received query:", query);
    const handler = allHandlers.find((handler) => {
      const matches = handler.match(query);
      console.log(`📋 Checking handler ${handler.name}: ${matches}`);
      return matches;
    });

    if (handler) {
      console.log("✅ Using handler:", handler.name);
      const result = await handler.handle(url);
      return HttpResponse.json({ result });
    }

    console.log("❌ No handler found for query:", query);
    return HttpResponse.json(
      { error: "No handler found for query" },
      { status: StatusCodes.NOT_FOUND },
    );
  }),
];
