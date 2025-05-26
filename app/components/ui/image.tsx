import { cn } from "~/lib/shadcn";
import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * The image ID from your CDN
   */
  imageId: string;
  /**
   * Optional size variant for the image
   * @default "original"
   */
  size?: "thumbnail" | "small" | "medium" | "large" | "original";
  /**
   * Optional quality parameter for the image
   * @default "auto"
   */
  quality?: "low" | "medium" | "high" | "auto";
  /**
   * Optional format for the image
   * @default "auto"
   */
  format?: "webp" | "avif" | "auto";
  /**
   * Optional fallback image URL
   */
  fallbackSrc?: string;
}

/**
 * A reusable image component for CDN-hosted images.
 * Handles image loading states, errors, and CDN transformations.
 *
 * @example
 * ```tsx
 * <Image
 *   imageId="profile-123"
 *   size="medium"
 *   quality="high"
 *   alt="User profile picture"
 *   className="rounded-full"
 * />
 * ```
 */
export function Image({
  imageId,
  // size = "original",
  // quality = "auto",
  // format = "auto",
  fallbackSrc = "/favicon.png",
  className,
  alt,
  onError,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // CDN URL construction
  const cdnUrl = "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images";
  const imageUrl = `${cdnUrl}/${imageId}`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    setIsLoading(false);
    onError?.(e);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      )}
      <img
        src={error && fallbackSrc ? fallbackSrc : imageUrl}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}
