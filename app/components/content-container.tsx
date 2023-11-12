import React from "react";
import moment from "moment";
import readingTime from "reading-time";
import { Section } from "./section";
import { Markdown } from "./markdown";
import { BackButton } from "./back-button";
import { Iframe } from "./iframe";

type Post = {
  frontmatter: {
    title: string;
    description: string;
    photo: string;
    video: string;
    createdAt: string;
  };
  code: string;
};
export function ContentContainer({
  to,
  text,
  ...post
}: {
  to: string;
  text: string;
  post: Post;
}) {
  const { frontmatter, code } = post as unknown as Post;
  const stats = readingTime(code);
  return (
    <Section className="!max-w-3xl md:px-0 flex flex-col gap-8">
      <BackButton to={to} text={text} className="pl-0 mb-4" />
      <div>
        <h1 className="text-4xl font-bold capitalize mb-4">
          {frontmatter.title}
        </h1>
        <p className="text-slate-400">
          {moment(frontmatter.createdAt).format("MMM DD, YYYY")} -- {stats.text}
        </p>
      </div>
      {frontmatter.photo ? (
        <img
          src={frontmatter.photo}
          alt={frontmatter.title}
          title={frontmatter.title}
          className="w-full rounded-md h-[18rem] md:h-[30rem]"
        />
      ) : null}
      <h2 className="text-xl font-bold">{frontmatter.description}</h2>

      {frontmatter.video ? (
        <Iframe src={frontmatter.video} title={frontmatter.title} />
      ) : null}
      <div className="dark:text-slate-300 text-slate-800 markdown">
        <Markdown source={code} />
      </div>
    </Section>
  );
}
