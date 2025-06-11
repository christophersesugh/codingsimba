import React from "react";
import type { Route } from "./+types/module";
import { Outlet } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  console.log(params);

  return {};
}

export default function CourseModuleRoute() {
  return (
    <div className="mt-20 text-4xl">
      course module
      <Outlet />
    </div>
  );
}
