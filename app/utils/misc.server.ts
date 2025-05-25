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
    if (!data) return null;
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function readMdxPageContent(pageName: string) {
  try {
    const data = await readPageContent(pageName);
    if (!data) return null;
    return (await bundleMDX({ source: data })).code;
  } catch (error) {
    console.error(error);
    return null;
  }
}
