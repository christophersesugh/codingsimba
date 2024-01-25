import { cn } from "~/utils/shadcn";

export function PageTitle({
  title = "",
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1 className={cn("my-8 capitalize text-2xl font-extrabold", className)}>
      {title}
    </h1>
  );
}
