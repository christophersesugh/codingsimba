import type { ReactNode } from "react";
import { Fade } from "react-awesome-reveal";

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
    <header className="md:px-16 mx-8 flex flex-col md:flex-row-reverse justify-center items-center gap-12 max-w-6xl md:mx-auto mt-12 mb-40 -z-50">
      <Fade className="w-full">{headerImage}</Fade>
      <div>
        <h1 className="text-4xl leading-normal ">
          {title}
          <br />
          <span className="mt-4 text-slate-400">{subtitle}</span>
        </h1>
        {children}
      </div>
    </header>
  );
}
