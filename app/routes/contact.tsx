import React from "react";
import type { Route } from "./+types/contact";
import { requireUserId } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserId(request);
  return {};
}

export default function ContactRoute() {
  return <div>contact</div>;
}
