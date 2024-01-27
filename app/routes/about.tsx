import type { MetaFunction } from "@remix-run/node";
import { DiscordButton } from "~/components/discord-button";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { metaFn } from "~/utils/meta";
import { getPage } from "~/utils/page.server";
import { Container } from "~/components/container";
import { Markdown } from "~/components/mdx";

export const meta: MetaFunction = metaFn;

export async function loader() {
  const content = getPage("about");
  return json({ content });
}

export default function About() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col">
      <h1 className="text-2xl mb-4">About CS</h1>
      <p className="text-lg">
        Hi, I&apos;m Christopher A. Sesugh, I&apos;m a software engineer and an
        educator. I help craft exceptional software solutions for
        tomorrow&apos;s challenges. I am also the founder of{" "}
        <Link to="https://casbytes.com">casbytes.com</Link>, an online school
        for software engineers.
      </p>
      <p className="py-4 self-start">
        You can find my social media handles in the footer of my website.
      </p>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={content} />
      </div>{" "}
      <DiscordButton />
    </Container>
  );
}
