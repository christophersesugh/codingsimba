import { useState } from "react";
import { cn } from "~/utils/misc";
import { VideoPlayer } from "./video-player";
import type { VideoMetadata, VideoSyncPoint } from "~/utils/video.server";

interface TutorialWithVideoProps {
  video: VideoMetadata;
  className?: string;
}

export function TutorialWithVideo({
  video,
  className,
}: TutorialWithVideoProps) {
  const [currentSyncPoint, setCurrentSyncPoint] =
    useState<VideoSyncPoint | null>(null);
  const [showCode, setShowCode] = useState(true);

  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      {/* Video Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {video.title}
          </h2>
          <button
            onClick={() => setShowCode(!showCode)}
            className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </button>
        </div>

        <VideoPlayer
          video={video}
          onSyncPointChange={setCurrentSyncPoint}
          className="w-full"
        />
      </div>

      {/* Code Section */}
      {showCode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Code Editor
            </h3>
            {currentSyncPoint && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentSyncPoint.description}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-900">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-gray-400">
                {currentSyncPoint?.lineStart && currentSyncPoint?.lineEnd
                  ? `Lines ${currentSyncPoint.lineStart}-${currentSyncPoint.lineEnd}`
                  : "Code Editor"}
              </div>
            </div>

            <div className="p-4">
              {currentSyncPoint ? (
                <pre className="overflow-x-auto text-sm text-gray-100">
                  <code>{currentSyncPoint.codeSnippet}</code>
                </pre>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Play the video to see synchronized code</p>
                </div>
              )}
            </div>
          </div>

          {/* Sync Points List */}
          {video.syncPoints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Video Timeline
              </h4>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {video.syncPoints.map((syncPoint, index) => (
                  <div
                    key={index}
                    className={cn(
                      "cursor-pointer rounded border p-2 text-xs transition-colors",
                      currentSyncPoint?.timestamp === syncPoint.timestamp
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
                    )}
                    onClick={() => {
                      // This would trigger the video to jump to this point
                      setCurrentSyncPoint(syncPoint);
                    }}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {syncPoint.description}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {Math.floor(syncPoint.timestamp / 60)}:
                      {(syncPoint.timestamp % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
