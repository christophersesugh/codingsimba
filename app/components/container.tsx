import React from "react";
import { cn } from "~/utils/shadcn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <section className={cn("max-w-2xl mx-auto px-4 mb-4", className)}>
      {children}
    </section>
  );
}
