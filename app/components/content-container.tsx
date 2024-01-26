import moment from "moment";
import { readingTime } from "reading-time-estimator";

import { BackButton } from "./back-button";
import { Iframe } from "./iframe";
import { Container } from "./container";
import { Markdown } from "./mdx";

export function ContentContainer({
  to,
  text,
  post,
}: {
  to: string;
  text: string;
  post: any;
}) {
  const { data, content } = post as any;

  const stats = readingTime(content);
  return (
    <Container className="max-w-3xl md:px-0 flex flex-col gap-8">
      <BackButton to={to} text={text} className="pl-0 mb-4" />
      <div>
        <h1 className="text-3xl capitalize mb-4">{data.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {moment(data.createdAt).format("MMM DD, YYYY")} ~ {stats.text}
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
      <h2 className="text-lg text-slate-600 dark:text-slate-300 p-4 mt-8 border-l-8 rounded-md border-blue-500 dark:bg-slate-700 bg-slate-200 ">
        {data.description}
      </h2>

      {data.video ? <Iframe src={data.video} title={data.title} /> : null}
      <div className="dark:text-slate-300 text-slate-800 markdown">
        <Markdown source={content} />
      </div>
    </Container>
  );
}
