import React from "react";
import moment from "moment";
import readingTime from "reading-time";
import { Section } from "./section";
import { Markdown } from "./markdown";
import { BackButton } from "./back-button";
import { Iframe } from "./iframe";

type Post = {
  data: {
    title: string;
    description: string;
    photo: string;
    video: string;
    createdAt: string;
  };
  content: string;
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
  const { data, content } = post as unknown as Post;
  const stats = readingTime(content);
  return (
    <Section className="!max-w-3xl md:px-0 flex flex-col gap-8">
      <BackButton to={to} text={text} className="pl-0 mb-4" />
      <div>
        <h1 className="text-4xl font-bold capitalize mb-4">{data.title}</h1>
        <p className="text-slate-400">
          {moment(data.createdAt).format("MMM DD, YYYY")} -- {stats.text}
        </p>
      </div>
      {data.photo ? (
        <img
          src={data.photo}
          alt={data.title}
          title={data.title}
          className="w-full rounded-md h-[18rem] md:h-[30rem]"
        />
      ) : null}
      <h2 className="text-xl font-bold">{data.description}</h2>

      {data.video ? <Iframe src={data.video} title={data.title} /> : null}
      <div className="dark:text-slate-300 text-slate-800 markdown">
        <Markdown source={content} />
      </div>
    </Section>
  );
}
