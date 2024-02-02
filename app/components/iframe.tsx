import { cn } from "~/utils/shadcn";

type IframeProps = {
  src: string;
  title: string;
  className?: string;
};

export function Iframe({ src, title, className }: IframeProps) {
  return (
    <iframe
      className={cn(
        "mx-auto w-full h-64 md:h-[28rem] lg:h-128 max-h-[32rem] rounded-md my-12",
        className,
      )}
      src={`https://www.youtube.com/embed/${src}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}
