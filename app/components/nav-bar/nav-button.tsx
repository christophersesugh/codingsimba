import React from "react";
import { NavLink } from "@remix-run/react";
import type { ButtonProps } from "../button";
import clsx from "clsx";
import { Button } from "../button";

interface NavButtonProps extends ButtonProps {
  to: string;
  ariaLabel: string;
}

export function NavButton({
  children,
  className,
  onClick,
  disabled,
  to,
  ariaLabel,
}: NavButtonProps) {
  return (
    <NavLink
      className={({ isActive }) => (isActive ? "underline text-blue-500" : "")}
      prefetch="intent"
      to={to}
    >
      <Button
        className={clsx("text-lg", className)}
        ariaLabel={ariaLabel}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </NavLink>
  );
}
