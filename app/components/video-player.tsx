import { useRef, useState } from "react";
import { cn } from "~/utils/misc";
import type { VideoMetadata, VideoSyncPoint } from "~/utils/video.server";

interface VideoPlayerProps {
  video: VideoMetadata;
  onSyncPointChange?: (syncPoint: VideoSyncPoint | null) => void;
  className?: string;
}

export function VideoPlayer({
  video,
  onSyncPointChange,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSyncPoint, setCurrentSyncPoint] =
    useState<VideoSyncPoint | null>(null);

  // Find the current sync point based on video time
  const findCurrentSyncPoint = (time: number): VideoSyncPoint | null => {
    return (
      video.syncPoints.find(
        (point) =>
          time >= point.timestamp &&
          (!video.syncPoints.find((next) => next.timestamp > point.timestamp) ||
            time <
              video.syncPoints.find((next) => next.timestamp > point.timestamp)!
                .timestamp),
      ) || null
    );
  };

  // Handle time updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    const syncPoint = findCurrentSyncPoint(time);
    if (syncPoint !== currentSyncPoint) {
      setCurrentSyncPoint(syncPoint);
      onSyncPointChange?.(syncPoint);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Jump to specific sync point
  const jumpToSyncPoint = (syncPoint: VideoSyncPoint) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = syncPoint.timestamp;
    setCurrentSyncPoint(syncPoint);
    onSyncPointChange?.(syncPoint);
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Video Player */}
      <div className="relative overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          className="h-auto w-full"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster={video.thumbnailUrl}
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={handlePlayPause}
              className="rounded-full p-2 transition-colors hover:bg-white/20"
            >
              {isPlaying ? (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <div className="text-sm font-medium">{video.title}</div>
              <div className="text-xs opacity-75">
                {formatTime(currentTime)} / {formatTime(video.duration)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Points Timeline */}
      {video.syncPoints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Code Sections
          </h3>
          <div className="space-y-1">
            {video.syncPoints.map((syncPoint, index) => (
              <button
                key={index}
                onClick={() => jumpToSyncPoint(syncPoint)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  currentSyncPoint?.timestamp === syncPoint.timestamp
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {syncPoint.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(syncPoint.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {syncPoint.lineStart && syncPoint.lineEnd
                      ? `Lines ${syncPoint.lineStart}-${syncPoint.lineEnd}`
                      : "Code snippet"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
