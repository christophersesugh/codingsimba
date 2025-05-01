import React from "react";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { cn } from "~/lib/shadcn";
import { Link } from "react-router";

interface EMetricsProps {
  id: string;
  views: number;
  _count: {
    likes: number;
    comments: number;
  };
}

export function EngagementMetrics({ metrics }: { metrics: EMetricsProps }) {
  const [, setLikeCount] = React.useState(87);
  const [userLikes, setUserLikes] = React.useState(0);

  const MAX_LIKES_COUNT = 5;

  const handleLike = () => {
    if (userLikes < MAX_LIKES_COUNT) {
      setLikeCount((prev) => prev + 1);
      setUserLikes((prev) => prev + 1);
    }
  };
  return (
    <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-200 py-4 dark:border-gray-800">
      <div className="flex items-center space-x-6">
        <div className="relative mr-4 flex items-center">
          <button
            onClick={handleLike}
            disabled={userLikes >= MAX_LIKES_COUNT}
            className={`"hover:text-red-500 dark:hover:text-red-400" flex items-center space-x-1`}
          >
            <Heart
              className={cn(
                "size-5 transition-colors duration-300 hover:fill-red-500 hover:text-red-500 dark:hover:fill-red-400 dark:hover:text-red-400",
                {
                  "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400":
                    userLikes >= 1,
                },
              )}
            />
            <span>{metrics._count.likes}</span>
            {userLikes >= MAX_LIKES_COUNT ? (
              <sub className="text-gray-500 dark:text-gray-400">max</sub>
            ) : null}
          </button>
        </div>
        <Link to={"#comments"} className="flex items-center space-x-1">
          <MessageSquare className="size-5" />
          <span>{metrics._count.comments}</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Eye className="size-5" />
          <span>{metrics.views.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  );
}
