import { Section } from "~/components/section";
import { Markdown } from "~/components/markdown";
import { metaFn } from "~/utils/meta";
import { useLoaderData } from "@remix-run/react";
// import { mdxBundle } from "~/utils/bundler.server";
import { json } from "@remix-run/node";
import { pPolicyContent } from "~/constants/page-content.server";

export const meta = metaFn;

export async function loader() {
  // const { code: content } = await mdxBundle({ source: pPolicyContent });
  return json({ content: pPolicyContent });
}

export default function PrivacyPolicy() {
  const { content } = useLoaderData<typeof loader>();

  return (
    <Section className="max-w-3xl flex flex-col items-center">
      <h2
        id="privacy-policy"
        className="text-2xl text-slate-800 dark:text-slate-100 my-6 underline underline-offset-4"
      >
        Privacy policy
      </h2>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={content} />
      </div>{" "}
    </Section>
  );
}
