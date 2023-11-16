import React from "react";
import { Section } from "~/components/section";
import { DiscordButton } from "~/components/discord-button";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { mdxBundle } from "~/utils/bundler.server";
import { Markdown } from "~/components/markdown";
import homeImage from "~/assets/home.webp";

export const meta: MetaFunction = () => {
  return [
    { title: "About | Coding Simba" },
    {
      property: "og:title",
      content: "About | Coding Simba",
    },
    {
      name: "description",
      content: "Helping change the world through building quality software.",
    },
    {
      property: "og:description",
      content: "Helping change the world through building quality software.",
    },
    {
      property: "og:image",
      content: `https://codingsimba.com/${homeImage}`,
    },
    {
      property: "og:url",
      content: "https://codingsimba.com/about",
    },
  ];
};

export async function loader() {
  const content = `Welcome to "Coding Simba," your gateway to the world of technology and
coding! I'm Christopher A. Sesugh, the curator of this tech-savvy haven.
With a passion for all things tech and a love for coding, I've embarked on
a journey to share my insights, knowledge, and experiences with you.

On this blog, you'll find a blend of tech-related topics, coding
tutorials, and the latest updates from the digital realm. My goal is to
demystify the world of technology and make it accessible to tech
enthusiasts of all levels. Whether you're a seasoned coder or just dipping
your toes into the tech waters, there's something here for everyone.

I believe that technology has the power to transform our lives, and I'm
dedicated to exploring the latest trends, discussing best practices, and
providing you with practical advice to help you navigate the ever-evolving
tech landscape. "Coding Simba" is not just a blog; it's a community of
tech enthusiasts, and I'm thrilled to have you on board.

Join me in this exciting journey of discovery, innovation, and
problem-solving. Let's unravel the mysteries of the digital world
together, one code at a time. Feel free to connect, share your thoughts,
and embark on this tech adventure with me.

Thank you for being a part of "Coding Simba Community". Together, we'll unlock the
endless possibilities of the tech universe.
`;
  const { code } = await mdxBundle({ source: content });
  return json({ code });
}

export default function About() {
  const { code } = useLoaderData<typeof loader>();
  return (
    <Section className="flex flex-col">
      <h1 className="text-2xl mb-4">About CS</h1>
      <p className="text-lg">
        Hi, I&apos;m Christopher A. Sesugh, I&apos;m a software engineer and an
        educator. I help change the world by building better software and
        sharing my existing knowledge with others by teaching.
      </p>
      <p className="py-4 self-start">
        You can find my social media handles in the footer of my website.
      </p>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={code} />
      </div>{" "}
      <DiscordButton />
    </Section>
  );
}
