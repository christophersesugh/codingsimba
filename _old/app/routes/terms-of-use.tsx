import { Section } from "~/components/section";
import { Markdown } from "~/components/markdown";
import { metaFn } from "~/utils/meta";
// import { mdxBundle } from "~/utils/bundler.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { tAndCContent } from "~/constants/page-content.server";

export const meta = metaFn;

export async function loader() {
  // const { code: content } = await mdxBundle({ source: tAndCContent });
  return json({ content: tAndCContent });
}

export default function TermsOfUse() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <Section className="max-w-3xl flex flex-col items-center">
      <h2 className="text-2xl text-slate-800 dark:text-slate-100 my-6 underline underline-offset-4">
        Terms of use
      </h2>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={content} />
      </div>{" "}
    </Section>
  );
}
