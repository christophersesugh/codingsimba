import React from "react";
import { motion } from "framer-motion";
import { cn } from "~/utils/shadcn";
import { containerVariants } from "~/animation-config";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("max-w-2xl mx-auto px-4 mb-4", className)}
    >
      {children}
    </motion.section>
  );
}
