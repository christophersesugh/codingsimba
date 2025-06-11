import React from "react";
import { Outlet } from "react-router";

export default function CoursesLayout() {
  return (
    <div className="mt-20 bg-red-500">
      courses layout
      <Outlet />
    </div>
  );
}
