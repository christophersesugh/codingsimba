import React from "react";
import clsx from "clsx";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <section className={clsx("max-w-2xl mx-auto px-4 mb-4", className)}>
      {children}
    </section>
  );
}
