import fs from "fs";
import path from "path";

export function getPage(pageName: string) {
  const pagePath = path.join(process.cwd(), "content/pages", `${pageName}.mdx`);
  const pageContent = fs.readFileSync(pagePath, "utf8");
  return pageContent;
}
