import React from "react";
import { Outlet } from "react-router";

export default function ProfileLayout() {
  return (
    <div>
      layout
      <Outlet />
    </div>
  );
}
