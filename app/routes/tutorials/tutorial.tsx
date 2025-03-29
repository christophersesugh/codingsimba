import React from "react";
import { Outlet } from "react-router";

export default function TutorialRoute() {
  return (
    <div className="mt-20">
      tutorial item
      <Outlet />
    </div>
  );
}
