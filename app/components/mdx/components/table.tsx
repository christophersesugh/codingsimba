import { cn } from "~/lib/shadcn";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full caption-bottom text-sm",
        "border border-gray-200 dark:border-gray-800",
        "border-separate border-spacing-0",
        "overflow-hidden rounded-lg",
        className,
      )}
      {...props}
    />
  );
}

// Table Header
export function Thead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50",
        className,
      )}
      {...props}
    />
  );
}

// Table Body
export function Tbody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

// Table Row
export function Tr({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50",
        className,
      )}
      {...props}
    />
  );
}

// Table Header Cell
export function Th({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-gray-700 dark:text-gray-300",
        className,
      )}
      {...props}
    />
  );
}

// Table Data Cell
export function Td({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "p-4 align-middle text-gray-700 dark:text-gray-300",
        className,
      )}
      {...props}
    />
  );
}

// Table Caption
export function Caption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  );
}

// Table Footer
export function Tfoot({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn("bg-gray-50 font-medium dark:bg-gray-800/50", className)}
      {...props}
    />
  );
}
