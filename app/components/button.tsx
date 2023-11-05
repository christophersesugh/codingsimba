import React from "react";
import clsx from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  id?: string;
  name?: string;
  value?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  className?: string;
  onClick?: any;
  disabled?: boolean;
}

export function Button({
  children,
  id,
  name,
  value,
  type = "button",
  ariaLabel,
  className,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      name={name}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx("p-2 rounded-md", className)}
    >
      {children}
    </button>
  );
}
