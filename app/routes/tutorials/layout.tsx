import React from "react";
import { Outlet } from "react-router";

export default function TutorialLayout() {
  return (
    <div className="mt-20">
      tutorial layout
      <Outlet />
    </div>
  );
}
