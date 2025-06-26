import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "~/utils/misc";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-gray-100 p-[3px] text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium transition-all",
        "border border-transparent text-gray-950",
        "focus-visible:outline-ring focus-visible:border-gray-950 focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-gray-950/50",
        "data-[state=active]:border-gray-200 data-[state=active]:bg-white data-[state=active]:shadow-sm",
        "dark:border-gray-800 dark:text-gray-400",
        "dark:focus-visible:border-gray-300 dark:focus-visible:ring-gray-300/50",
        "dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
