import type { MetaFunction } from "@remix-run/node";
import { BsDiscord } from "react-icons/bs";
import { PageHeader } from "~/components/home/page-header";
import { HeaderButton } from "~/components/header-button";
import { Section } from "~/components/section";
import { Markdown } from "~/components/markdown";
import { DiscordButton } from "~/components/discord-button";
import { mdxBundle } from "~/utils/bundler.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { metaFn } from "~/utils/meta";
import { discordContent } from "~/constants/page-content.server";

export const meta: MetaFunction = metaFn;

export async function loader() {
  const { code: content } = await mdxBundle({ source: discordContent });
  return json({ content });
}

export default function Discord() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <>
      <PageHeader
        title="Join Coding Simba's discord community for engaging conversations on all things Tech!"
        headerImage={
          <BsDiscord className="text-[18rem] block animate-pulse mx-auto" />
        }
      >
        <HeaderButton
          to="#reasons"
          buttonText="Why you should join CS' discord community..."
          otherProps={<DiscordButton />}
        />
      </PageHeader>
      <Section className="max-w-3xl flex flex-col items-center mx-8">
        <div className="dark:text-slate-300 text-slate-600" id="reasons">
          <Markdown source={content} />
        </div>{" "}
        <DiscordButton />
      </Section>
    </>
  );
}
