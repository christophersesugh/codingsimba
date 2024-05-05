import { metaFn } from "~/utils/meta";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPageContent } from "~/utils/page.server";
import { Container } from "~/components/container";
import { Markdown } from "~/components/mdx";

export const meta = metaFn;

export async function loader() {
  const content = getPageContent("privacy-policy");
  return json({ content });
}

export default function PrivacyPolicy() {
  const { content } = useLoaderData<typeof loader>();

  return (
    <Container className="max-w-3xl flex flex-col items-center">
      <h2
        id="privacy-policy"
        className="text-2xl text-slate-800 dark:text-slate-100 my-6 underline underline-offset-4"
      >
        Privacy policy
      </h2>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={content} />
      </div>{" "}
    </Container>
  );
}
