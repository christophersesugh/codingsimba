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
        <p className="text-slate-500 dark:text-slate-400 font-black text-lg">
          {moment(data.createdAt).format("MMM DD, YYYY")} -- {stats.text}
        </p>
      </div>
      {data.photo ? (
        <img
          src={data.photo}
          alt={data.title}
          title={data.title}
          className="w-full rounded-md h-[16rem] md:h-[28rem]"
        />
      ) : null}
      <h2 className="text-xl font-black text-slate-600 dark:text-slate-300 p-4 mt-8 border-l-8 rounded-md border-blue-500 dark:bg-slate-700 bg-slate-200 ">
        {data.description}
      </h2>

      {data.video ? <Iframe src={data.video} title={data.title} /> : null}
      <div className="dark:text-slate-300 text-slate-800 markdown">
        <Markdown source={content} />
      </div>
    </Section>
  );
}
