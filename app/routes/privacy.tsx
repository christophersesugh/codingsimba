import type { Route } from "./+types/privacy";
import { StatusCodes } from "http-status-codes";
import { Markdown } from "~/components/mdx";
import { Header } from "~/components/page-header";
import { generateMetadata } from "~/utils/meta";
import { invariantResponse } from "~/utils/misc";
import { readMdxPageContent } from "~/utils/misc.server";

export async function loader() {
  const pageContent = await readMdxPageContent("privacy");
  invariantResponse(pageContent, "Page content not found", {
    status: StatusCodes.NOT_FOUND,
  });
  return { pageContent };
}

export default function PrivacyRoute({ loaderData }: Route.ComponentProps) {
  const metadata = generateMetadata({ title: "Privacy Policy" });

  return (
    <>
      {metadata}
      <Header
        title="Privacy Policy"
        description="Your privacy is important to us. This policy outlines how we handle your data."
      />
      <section>
        <Markdown source={loaderData.pageContent.code} />
      </section>
    </>
  );
}
