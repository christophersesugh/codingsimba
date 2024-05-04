import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { imageLoadAnimationProps, textVariants } from "~/animation-config";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  headerImage: ReactNode;
  children: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  headerImage,
  children,
}: PageHeaderProps) {
  return (
    <motion.header className="md:px-16 mx-8 flex flex-col md:flex-row-reverse justify-center items-center gap-12 max-w-6xl md:mx-auto mt-12 mb-40 -z-50">
      <motion.div {...imageLoadAnimationProps} className="w-full">
        {headerImage}
      </motion.div>
      <motion.div>
        <motion.h1 variants={textVariants} className="text-4xl leading-normal ">
          {title}
          <br />
          <motion.span variants={textVariants} className="mt-4 text-slate-400">
            {subtitle}
          </motion.span>
        </motion.h1>
        {children}
      </motion.div>
    </motion.header>
  );
}
