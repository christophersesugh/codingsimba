import { json } from "@remix-run/server-runtime";
import { metaFn } from "~/utils/meta";
import { useLoaderData } from "@remix-run/react";
import { Markdown } from "~/components/mdx";
import { Container } from "~/components/container";
import { getPageContent } from "~/utils/page.server";

export const meta = metaFn;

export async function loader() {
  const content = getPageContent("terms-of-use");
  return json({ content });
}

export default function TermsOfUse() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <Container className="max-w-3xl flex flex-col items-center">
      <h2 className="text-2xl text-slate-800 dark:text-slate-100 my-6 underline underline-offset-4">
        Terms of use
      </h2>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={content} />
      </div>{" "}
    </Container>
  );
}
