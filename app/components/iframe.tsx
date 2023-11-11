import clsx from "clsx";
import React from "react";

type IframeProps = {
  src: string;
  title: string;
  className?: string;
};

export function Iframe({ src, title, className }: IframeProps) {
  return (
    <iframe
      className={clsx(
        "mx-auto w-full h-64 md:h-96 lg:h-128 max-h-[32rem] rounded-md",
        className,
      )}
      src={`https://www.youtube.com/embed/${src}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}
