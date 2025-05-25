import { cn } from "~/lib/shadcn";

export function Img({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={cn(
        "mx-auto my-6 aspect-video max-w-full rounded-md border object-cover shadow-sm",
        className,
      )}
      loading="lazy"
      {...props}
    />
  );
}

interface MDXIframeProps {
  videoId: string;
  type: "youtube" | "bunny";
}

export function Iframe({ videoId, type = "youtube" }: MDXIframeProps) {
  const srcUrls = {
    youtube:
      `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3` as const,
    bunny: `https://video.bunnycdn.com/embed/${videoId}` as const,
  };

  const srcTitle = {
    youtube: `YouTube video player`,
    bunny: `Bunny video player`,
  };

  return (
    <iframe
      src={srcUrls[type]}
      title={srcTitle[type]}
      allowFullScreen
      loading="lazy"
      className="aspect-video w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
