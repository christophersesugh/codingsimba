import { invariantResponse } from "~/utils/misc";

const BUNNY_STORAGE_ZONE = "https://storage.bunnycdn.com/codingsimba";
const BUNNY_PULL_ZONE = "https://codingsimba.b-cdn.net";
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;

export interface VideoSyncPoint {
  timestamp: number; // seconds
  codeSnippet: string;
  lineStart?: number;
  lineEnd?: number;
  description: string;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  syncPoints: VideoSyncPoint[];
  tutorialId: string;
}

/**
 * Upload video to Bunny CDN
 */
export async function uploadVideo(
  file: File,
  tutorialId: string,
  metadata: Partial<VideoMetadata>,
): Promise<VideoMetadata> {
  invariantResponse(BUNNY_API_KEY, "Bunny API key not configured");

  const videoId = `${tutorialId}-${Date.now()}`;
  const fileName = `${videoId}.mp4`;

  // Upload to Bunny CDN
  const uploadResponse = await fetch(
    `${BUNNY_STORAGE_ZONE}/videos/${fileName}`,
    {
      method: "PUT",
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": "video/mp4",
      },
      body: file,
    },
  );

  invariantResponse(uploadResponse.ok, "Failed to upload video");

  const videoUrl = `${BUNNY_PULL_ZONE}/videos/${fileName}`;
  const thumbnailUrl = `${BUNNY_PULL_ZONE}/thumbnails/${videoId}.jpg`;

  return {
    id: videoId,
    title: metadata.title || "Untitled Video",
    description: metadata.description || "",
    duration: 0, // Will be updated after processing
    thumbnailUrl,
    videoUrl,
    syncPoints: metadata.syncPoints || [],
    tutorialId,
  };
}

/**
 * Generate video thumbnail
 */
export async function generateThumbnail(videoId: string): Promise<string> {
  invariantResponse(BUNNY_API_KEY, "Bunny API key not configured");

  // Use Bunny CDN's thumbnail generation API
  const thumbnailUrl = `${BUNNY_PULL_ZONE}/thumbnails/${videoId}.jpg`;

  // Trigger thumbnail generation
  await fetch(`${BUNNY_STORAGE_ZONE}/thumbnails/${videoId}.jpg`, {
    method: "POST",
    headers: {
      AccessKey: BUNNY_API_KEY,
    },
  });

  return thumbnailUrl;
}

/**
 * Get video metadata with sync points
 */
export async function getVideoMetadata(
  videoId: string,
): Promise<VideoMetadata | null> {
  // This would typically fetch from your database
  console.log(`Fetching metadata for video: ${videoId}`);
  // For now, return mock data
  return null;
}

/**
 * Update video sync points
 */
export async function updateVideoSyncPoints(
  videoId: string,
  syncPoints: VideoSyncPoint[],
): Promise<void> {
  // Update sync points in database
  // This would typically update your database
  console.log(`Updating sync points for video ${videoId}:`, syncPoints);
}
