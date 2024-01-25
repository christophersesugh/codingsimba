import type { ReactNode } from "react";
import React from "react";
import clsx from "clsx";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export function Section({ children, className }: SectionProps) {
  return (
    <section className={clsx("max-w-2xl mx-auto px-4 mb-4", className)}>
      {children}
    </section>
  );
}
