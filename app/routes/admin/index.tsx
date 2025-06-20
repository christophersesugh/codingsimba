import React from "react";
import type { Route } from "./+types/index";
import { requireUserWithRole } from "~/utils/permissions.server";
import { generateMetadata } from "~/utils/meta";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserWithRole(request, "ADMIN");
  return {};
}

export default function AdminIndexRoute() {
  const metadata = generateMetadata({ title: "Admin" });

  return (
    <>
      {metadata}
      <div>index</div>
    </>
  );
}
