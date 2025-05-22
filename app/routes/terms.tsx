import { StatusCodes } from "http-status-codes";
import type { Route } from "./+types/terms";
import { Markdown } from "~/components/mdx";
import { Header } from "~/components/page-header.client";
import { invariantResponse } from "~/utils/misc";
import { readPageContent } from "~/utils/misc.server";

export async function loader() {
  const pageContent = await readPageContent("terms");
  invariantResponse(pageContent, "Page content not found", {
    status: StatusCodes.NOT_FOUND,
  });
  return { pageContent };
}

export default function TermsRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Header
        title="Terms of Service"
        description="These Terms of Service govern your use of our website and services."
      />
      <section>
        <Markdown source={loaderData.pageContent} />
      </section>
    </div>
  );
}
