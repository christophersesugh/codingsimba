import type { FileUpload } from "@mjackson/form-data-parser";
import { uploadToBunny } from "~/services.server/bunny/file-upload";
import { getErrorMessage } from "./misc";

type UploadHandlerOptions = {
  fieldName?: string;
  uploadPath: string;
  /**
   * @default true
   */
  generateUniqueFilename?: boolean;
};

export type UploadedFile = File & {
  url: string;
  originalName: string;
  size: number;
  type: string;
};

/**
 * Creates a file upload handler for BunnyCDN.
 * This function reads the file stream, uploads it to BunnyCDN,
 * and returns a new File object with additional properties.
 * The file is uploaded to the specified path with a unique filename.
 * If the `generateUniqueFilename` option is set to true, a unique filename
 * is generated using `crypto.randomUUID()`. Otherwise, the original filename
 * is used.
 * The file URL is generated based on the upload path.
 * @param options - Options for the upload handler
 * @param options.fieldName - The expected field name for the file upload
 * @param options.uploadPath - The path where the file will be uploaded
 * @param options.generateUniqueFilename - Whether to generate a unique filename for the uploaded file
 * @returns  {function} - A function that handles the file upload
 * @throws {Error} - Throws an error if the field name does not match or if the upload fails
 */
export function createUploadHandler(
  options: UploadHandlerOptions,
  onUploadComplete?: (fileUrl: string) => void | Promise<void>,
) {
  const { fieldName, uploadPath, generateUniqueFilename = true } = options;

  return async function uploadHandler(file: FileUpload) {
    if (fieldName && file.fieldName !== fieldName) {
      throw new Error(
        `Invalid file field name. Expected '${fieldName}', got '${file.fieldName}'`,
      );
    }

    const chunks: Uint8Array[] = [];
    const reader = file.stream().getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const fileBuffer = Buffer.concat(chunks);

    // Generate filename
    const fileExtension = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf("."))
      : "";

    const finalFilename = generateUniqueFilename
      ? `${crypto.randomUUID()}${fileExtension}`
      : file.name;

    // Normalize path
    const normalizedPath = `${uploadPath}/${finalFilename}`
      .replace(/\/+/g, "/")
      .replace(/^\/|\/$/g, "");

    // Upload to BunnyCDN
    try {
      const fileUrl = await uploadToBunny({
        data: fileBuffer,
        path: normalizedPath,
        contentType: file.type,
      });
      await onUploadComplete?.(fileUrl);
    } catch (error) {
      throw new Error(
        `Failed to upload to BunnyCDN: ${getErrorMessage(error)}`,
        {
          cause: error,
        },
      );
    }

    const newFile = new File([fileBuffer], finalFilename, {
      type: file.type,
      lastModified: Date.now(),
    });

    return newFile;
  };
}
