import React from "react";
import { useFetcher } from "react-router";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { cn } from "~/lib/shadcn";
import { Link } from "react-router";
import { useOptionalUser } from "~/hooks/user";

interface EMetricsProps {
  id: string;
  views: number;
  _count: {
    likes: number;
    comments: number;
  };
  likes: {
    count: number;
    userId: string | null;
  }[];
}

export function EngagementMetrics({ metrics }: { metrics?: EMetricsProps }) {
  const fetcher = useFetcher();
  const user = useOptionalUser();
  const MAX_LIKES = 5;
  const LEAST_COUNT = 0;

  const totalLikes = metrics?._count.likes ?? LEAST_COUNT;
  const userLikes =
    metrics?.likes.find((like) => like.userId === user?.id)?.count ??
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

    fetcher.submit(
      { intent: "upvote", itemId: metrics?.id ?? "" },
      { method: "post" },
    );
  }
  return (
    <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-200 py-4 dark:border-gray-800">
      <div className="flex items-center space-x-6">
        <div className="relative mr-4 flex items-center">
          <button
            onClick={handleUpvote}
            disabled={optimisticState.userLikes >= MAX_LIKES}
            className="flex items-center gap-1"
            aria-label={
              optimisticState.userLikes > 0
                ? "Upvote (already liked)"
                : "Upvote"
            }
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
            <span>{optimisticState.totalLikes}</span>
            {optimisticState.userLikes >= MAX_LIKES ? (
              <sub className="text-gray-500 dark:text-gray-400">max</sub>
            ) : null}
          </button>
        </div>
        <Link to={"#comments"} className="flex items-center space-x-1">
          <MessageSquare className="size-5" />
          <span>{metrics?._count.comments ?? LEAST_COUNT}</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Eye className="size-5" />
          <span>{metrics?.views.toLocaleString() ?? LEAST_COUNT} views</span>
        </div>
      </div>
    </div>
  );
}
