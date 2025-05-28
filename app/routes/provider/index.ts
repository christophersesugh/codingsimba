import { ProviderNameSchema } from "~/components/provider-connection-form";
import type { Route } from "./+types/index";
import { redirect } from "react-router";
import { authenticator } from "~/utils/auth.server";
import { handleMockAction } from "~/utils/connection.server";
import { getReferrerRoute } from "~/utils/misc";
import { getRedirectCookieHeader } from "~/utils/redirect-cookie.server";

export async function loader() {
  return redirect("/signin");
}

export async function action({ request, params }: Route.ActionArgs) {
  const providerName = ProviderNameSchema.parse(params.provider);

  try {
    await handleMockAction(providerName, request);
    return await authenticator.authenticate(providerName, request);
  } catch (error: unknown) {
    console.log({ error });

    if (error instanceof Response) {
      const formData = await request.formData();
      const rawRedirectTo = formData.get("redirectTo");
      const redirectTo =
        typeof rawRedirectTo === "string"
          ? rawRedirectTo
          : getReferrerRoute(request);
      const redirectToCookie = getRedirectCookieHeader(redirectTo);
      if (redirectToCookie) {
        error.headers.append("set-cookie", redirectToCookie);
      }
    }
    throw error;
  }
}
