import React from "react";
import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import type { ButtonProps } from "../button";
import { Button } from "../button";

interface NavButton extends ButtonProps {
  to: string;
}

export function NavButton({ className, to, children, ...props }: NavButton) {
  return (
    <NavLink
      className={({ isActive }) => (isActive ? "underline text-blue-500" : "")}
      prefetch="render"
      to={to}
    >
      <Button className={clsx("text-lg", className)} {...props}>
        {children}
      </Button>
    </NavLink>
  );
}
