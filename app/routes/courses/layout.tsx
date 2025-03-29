import React from "react";
import { Outlet } from "react-router";

export default function CoursesLayout() {
  return (
    <div>
      courses layout
      <Outlet />
    </div>
  );
}
