import React from "react";
import type { Route } from "./+types/index";
import { requireUserWithRole } from "~/utils/permissions.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserWithRole(request, "ADMIN");
  return {};
}

export default function AdminIndexRoute() {
  return <div>index</div>;
}
