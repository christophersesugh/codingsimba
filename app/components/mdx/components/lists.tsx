import { cn } from "~/lib/shadcn";

export function Ul({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        "my-6 ml-6 list-disc text-gray-700 dark:text-gray-300 [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

export function Ol({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal text-gray-700 dark:text-gray-300 [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}
