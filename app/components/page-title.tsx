import clsx from "clsx";

export function PageTitle({
  title = "",
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1 className={clsx("my-8 capitalize text-2xl font-extrabold", className)}>
      {title}
    </h1>
  );
}
