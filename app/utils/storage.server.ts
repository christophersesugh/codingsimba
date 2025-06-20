import type { FilePath } from "./misc";

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

const BASE_HOSTNAME = "storage.bunnycdn.com";
const HOSTNAME = BASE_HOSTNAME; //No region, may change later
const URL = `https://${HOSTNAME}/${BUNNY_STORAGE_ZONE}`;

/**
 * Options for uploading a file to BunnyCDN storage.
 *
 * @property data - The file data to upload (File or FileUpload)
 * @property path - The destination path in the storage zone (optional)
 * @property contentType - The MIME type of the file (optional, defaults to 'application/octet-stream')
 */
interface UploadFileToStorageOptions {
  file: File;
  path?: FilePath;
  contentType?: string;
}

/**
 * Uploads a file to BunnyCDN storage using the provided options.
 *
 * @param options - The upload options (file data, path, content type, region)
 * @returns An object with status ('success' or 'error') and error message (if any)
 *
 * @example
 * ```ts
 * const result = await uploadFIleToStorage({
 *   file: file,
 *   path: 'uploads/myfile.png',
 *   contentType: 'image/png',
 * });
 * if (result.status === 'success') {
 *   // File uploaded successfully
 * } else {
 *   // Handle error
 * }
 * ```
 */
export async function uploadFIleToStorage(
  options: UploadFileToStorageOptions,
): Promise<{ status: string; error: string | null }> {
  const { file, path, contentType = "application/octet-stream" } = options;
  const UPLOAD_URL = `${URL}/${path}/${file.name}`;
  const response = await fetch(UPLOAD_URL, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_ACCESS_KEY,
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    return { status: "error", error: "Failed to upload file" } as const;
  } else {
    return { status: "success", error: null } as const;
  }
}

interface DeleteFileFromStorageOptions {
  fileKey: string;
  path: FilePath;
}

export async function deleteFileFromStorage(
  options: DeleteFileFromStorageOptions,
) {
  const { path, fileKey } = options;
  const DELETE_URL = `${URL}/${path}/${fileKey}`;
  const response = await fetch(DELETE_URL, {
    method: "DELETE",
    headers: {
      AccessKey: BUNNY_ACCESS_KEY,
    },
  });

  if (!response.ok) {
    return { status: "error", error: "Failed to delete file" } as const;
  } else {
    return { status: "success", error: null } as const;
  }
}
