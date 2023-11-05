import React from "react";
import { Section } from "~/components/section";
import { Markdown } from "~/components/markdown";
import { DiscordButton } from "~/components/discord-button";
// import { metaData } from "~/utils/meta";

// export const meta = metaData({ title: "About", url: "about" });

export default function About() {
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
        <Markdown source={content} />
      </div>{" "}
      <DiscordButton />
    </Section>
  );
}

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
