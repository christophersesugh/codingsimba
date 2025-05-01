interface UploadToBunnyOptions {
  data: Buffer | Blob;
  path: string;
  contentType: string;
  region?: string;
}

export async function uploadToBunny(
  options: UploadToBunnyOptions,
): Promise<string> {
  const {
    data,
    path,
    contentType = "application/octet-stream",
    region = "",
  } = options;

  const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
  const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

  const BASE_HOSTNAME = "storage.bunnycdn.com";

  const HOSTNAME = region ? `${region}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
  const UPLOAD_URL = `https://${HOSTNAME}/${BUNNY_STORAGE_ZONE}/${path}`;

  const response = await fetch(UPLOAD_URL, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_ACCESS_KEY,
      "Content-Type": contentType,
    },
    body: data,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`File upload failed: ${response.status} ${errorText}`);
  }

  return "https://loremflickr.com/1540/994?lock=4824176450717785";

  // `https://cdn.codingsimba.com/${path}`;
}
