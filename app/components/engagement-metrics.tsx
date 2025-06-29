import React from "react";
import type { Route } from "../routes/articles/+types/article";
import { Await, useFetcher, useLoaderData } from "react-router";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { cn } from "~/utils/misc";
import { Link } from "react-router";
import { useOptionalUser } from "~/hooks/user";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

type Like = {
  count: number;
  userId: string;
};

export function EngagementMetrics({ className }: { className?: string }) {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  return (
    <React.Suspense fallback={<MetricsSkeleton className={className} />}>
      <Await
        resolve={loaderData.metrics}
        errorElement={<MetricsError className={className} />}
      >
        {(metrics) =>
          metrics ? (
            <MetricsContent metrics={metrics} className={className} />
          ) : (
            <NoMetrics className={className} />
          )
        }
      </Await>
    </React.Suspense>
  );
}

function MetricsSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col items-start justify-between border-b border-gray-200 py-4 dark:border-gray-800",
        className,
      )}
    >
      <div className="flex items-center space-x-6">
        <Skeleton className="h-4 w-8 rounded-xl" />
        <Skeleton className="h-4 w-8 rounded-xl" />
        <Skeleton className="h-4 w-14 rounded-xl" />
      </div>
    </div>
  );
}

function NoMetrics({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col items-start justify-between border-b border-gray-200 py-4 dark:border-gray-800",
        className,
      )}
    >
      <div className="flex items-center space-x-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          No metrics
        </span>
      </div>
    </div>
  );
}

function MetricsError({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col items-start justify-between border-b border-gray-200 py-4 dark:border-gray-800",
        className,
      )}
    >
      <div className="flex items-center space-x-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Failed to load metrics
        </span>
      </div>
    </div>
  );
}

function MetricsContent({
  metrics,
  className,
}: {
  metrics: Awaited<Route.ComponentProps["loaderData"]["metrics"]> | null;
  className?: string;
}) {
  const [showFloating, setShowFloating] = React.useState(false);
  const [animationKey, setAnimationKey] = React.useState(0);
  const fetcher = useFetcher();
  const user = useOptionalUser();
  const userId = user?.id;
  const MAX_LIKES = 5;
  const LEAST_COUNT = 0;

  const totalLikes =
    metrics?.likes?.reduce(
      (total: number, like: Like) => total + like.count,
      0,
    ) ?? LEAST_COUNT;

  const userLikes =
    metrics?.likes.find((like: Like) => like.userId === userId)?.count ??
    LEAST_COUNT;

  const [optimisticState, setOptimisticState] = React.useState({
    totalLikes,
    userLikes,
  });

  React.useEffect(() => {
    if (metrics) {
      setOptimisticState({
        totalLikes,
        userLikes,
      });
    }
  }, [metrics, totalLikes, userLikes]);

  function handleUpvote() {
    if (optimisticState.userLikes >= MAX_LIKES) return;
    setOptimisticState((prev) => ({
      totalLikes: prev.totalLikes + 1,
      userLikes: prev.userLikes + 1,
    }));

    setShowFloating(true);
    setAnimationKey((prev) => prev + 1);

    setTimeout(() => {
      setShowFloating(false);
    }, 1000);

    fetcher.submit(
      { intent: "upvote-article", itemId: metrics?.id ?? "", userId: userId! },
      { method: "post" },
    );
  }

  if (!metrics) return <MetricsSkeleton className={className} />;

  return (
    <div
      className={cn(
        "mb-8 flex flex-col items-start justify-between border-b border-gray-200 py-4 dark:border-gray-800",
        className,
      )}
    >
      <div className="flex items-center space-x-6">
        <div className="relative mr-4 flex items-center">
          <button
            onClick={handleUpvote}
            disabled={optimisticState.userLikes >= MAX_LIKES}
            className="flex items-center gap-1"
            aria-label="Upvote"
          >
            <Heart
              className={cn("size-5 transition-colors", {
                "fill-red-500 text-red-500":
                  optimisticState.userLikes > LEAST_COUNT,
                "hover:fill-red-500 hover:text-red-500":
                  optimisticState.userLikes < MAX_LIKES,
                "opacity-80": optimisticState.userLikes >= MAX_LIKES,
              })}
            />
            <span>{optimisticState.totalLikes.toLocaleString()}</span>
            {optimisticState.userLikes >= MAX_LIKES ? (
              <sub className="text-gray-500 dark:text-gray-400">max</sub>
            ) : null}
          </button>
          <AnimatePresence>
            {showFloating && (
              <motion.div
                key={animationKey}
                initial={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  y: -40,
                  scale: 1.2,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2"
              >
                <span className="text-lg font-bold text-red-500">+1</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link to={"#comments"} className="flex items-center space-x-1">
          <MessageSquare className="size-5" />
          <span>
            {metrics?._count.comments.toLocaleString() ?? LEAST_COUNT}
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Eye className="size-5" />
          <span>{metrics?.views.toLocaleString() ?? LEAST_COUNT} views</span>
        </div>
      </div>
    </div>
  );
}
