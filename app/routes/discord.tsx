import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { BsDiscord } from "react-icons/bs";
import { PageHeader } from "~/components/home/page-header";
import { HeaderButton } from "~/components/header-button";
import { DiscordButton } from "~/components/discord-button";
import { useLoaderData } from "@remix-run/react";
import { metaFn } from "~/utils/meta";
import { getPage } from "~/utils/page.server";
import { Container } from "~/components/container";
import { Markdown } from "~/components/mdx";

export const meta: MetaFunction = metaFn;

export async function loader() {
  const content = getPage("discord");
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
      <Container className="max-w-3xl flex flex-col items-center mx-8">
        <div className="dark:text-slate-300 text-slate-600" id="reasons">
          <Markdown source={content} />
        </div>{" "}
        <DiscordButton />
      </Container>
    </>
  );
}
