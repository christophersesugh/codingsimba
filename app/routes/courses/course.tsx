import React from "react";
import type { Route } from "./+types/course";
import { Outlet } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  console.log(params);

  return {};
}

export default function CourseRoute() {
  return (
    <div>
      course item
      <Outlet />
    </div>
  );
}
