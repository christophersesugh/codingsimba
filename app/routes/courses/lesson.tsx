import React from "react";
import type { Route } from "./+types/lesson";

export async function loader({ params }: Route.LoaderArgs) {
  console.log(params);

  return {};
}

export default function CourseLessonsRoute() {
  return <div>course lesson</div>;
}
