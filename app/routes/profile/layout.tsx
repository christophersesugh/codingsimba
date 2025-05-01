import React from "react";
import { Outlet } from "react-router";

export default function ProfileLayout() {
  return (
    <div className="mt-20">
      layout
      <Outlet />
    </div>
  );
}
