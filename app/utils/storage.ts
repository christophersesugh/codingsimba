import { z } from "zod";

// Constants
const ONE_KB = 1024;
export const MAX_FILE_SIZE = 3 * ONE_KB * ONE_KB; // 3MB
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

// Schema
export const ImageSchema = z
  .instanceof(File, { message: "Image file is required" })
  .refine((file) => file.size > 0 && file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than or equal to ${MAX_FILE_SIZE / ONE_KB / ONE_KB}MB`,
  })
  .refine(
    (file) =>
      ALLOWED_MIME_TYPES.includes(
        file.type as (typeof ALLOWED_MIME_TYPES)[number],
      ),
    {
      message: `Only ${ALLOWED_EXTENSIONS.join(", ")} files are allowed`,
    },
  );
