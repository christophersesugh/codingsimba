import fs from "node:fs/promises";
import path from "node:path";
import { bundleMDX } from "./mdx.server";

export async function readPageContent(
  pageName: string,
): Promise<string | null> {
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), "content/pages", `${pageName}.mdx`),
      "utf-8",
    );
    return (await bundleMDX({ source: data })).code;
  } catch (err) {
    console.error(err);
    return null;
  }
}
