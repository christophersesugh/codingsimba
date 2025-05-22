import type { Route } from "./+types/privacy";
import { StatusCodes } from "http-status-codes";
import { Markdown } from "~/components/mdx";
import { Header } from "~/components/page-header.client";
import { invariantResponse } from "~/utils/misc";
import { readPageContent } from "~/utils/misc.server";

export async function loader() {
  const pageContent = await readPageContent("privacy");
  invariantResponse(pageContent, "Page content not found", {
    status: StatusCodes.NOT_FOUND,
  });
  return { pageContent };
}

export default function PrivacyRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Header
        title="Privacy Policy"
        description="Your privacy is important to us. This policy outlines how we handle your data."
      />
      <section>
        <Markdown source={loaderData.pageContent} />
      </section>
    </div>
  );
}
