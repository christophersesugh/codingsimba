import { Skeleton } from "~/components/ui/skeleton";

export function RoadmapSkeleton() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 md:left-1/2 md:-translate-x-px" />
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 md:gap-8">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-white dark:border-blue-400 dark:bg-gray-900">
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
