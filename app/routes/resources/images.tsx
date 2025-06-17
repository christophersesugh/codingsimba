import { promises as fs, constants } from "node:fs";
// import { getImgResponse } from "openimg/node";
// import { getSignedGetRequestInfo } from "~/utils/storage.server";
// import { type Route } from "./+types/images";
// import { getDomainUrl, invariantResponse } from "~/utils/misc";
// import { StatusCodes } from "http-status-codes";

let cacheDir: string | null = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getCacheDir() {
  if (cacheDir) return cacheDir;

  let dir = "./tests/fixtures/openimg";
  if (process.env.NODE_ENV === "production") {
    const isAccessible = await fs
      .access("/data", constants.W_OK)
      .then(() => true)
      .catch(() => false);

    if (isAccessible) {
      dir = "/data/images";
    }
  }

  return (cacheDir = dir);
}

export async function loader() {
  return {};
  // const url = new URL(request.url);
  // const searchParams = url.searchParams;

  const headers = new Headers();
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  // const objectKey = searchParams.get("objectKey");

  //   return getImgResponse(request, {
  //     headers,
  //     allowlistedOrigins: [
  //       getDomainUrl(request),
  //       process.env.AWS_ENDPOINT_URL_S3,
  //     ].filter(Boolean),
  //     cacheFolder: await getCacheDir(),
  //     getImgSource: () => {
  //       if (objectKey) {
  //         const { url: signedUrl, headers: signedHeaders } =
  //           getSignedGetRequestInfo(objectKey);
  //         return {
  //           type: "fetch",
  //           url: signedUrl,
  //           headers: signedHeaders,
  //         };
  //       }

  //       const src = searchParams.get("src");
  //       invariantResponse(src, "src query parameter is required", {
  //         status: StatusCodes.NOT_FOUND,
  //       });

  //       if (URL.canParse(src)) {
  //         // Fetch image from external URL; will be matched against allowlist
  //         return {
  //           type: "fetch",
  //           url: src,
  //         };
  //       }
  //       // Retrieve image from filesystem (public folder)
  //       if (src.startsWith("/assets")) {
  //         // Files managed by Vite
  //         return {
  //           type: "fs",
  //           path: "." + src,
  //         };
  //       }
  //       // Fallback to files in public folder
  //       return {
  //         type: "fs",
  //         path: "./public" + src,
  //       };
  //     },
  //   });
}
