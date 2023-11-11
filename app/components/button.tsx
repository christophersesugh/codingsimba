import React from "react";
import clsx from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: any;
  value?: string | undefined;
  name?: string | undefined;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  className,
  onClick,
  name,
  value,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      value={value}
      name={name}
      onClick={onClick}
      className={clsx("p-2 rounded-md", className)}
      {...props}
    >
      {children}
    </button>
  );
}
