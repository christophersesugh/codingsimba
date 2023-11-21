import React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { BsArrowRight } from "react-icons/bs";
import { Section } from "~/components/section";
import { Markdown } from "~/components/markdown";
import { metaFn } from "~/utils/meta";
import { json } from "@remix-run/node";
// import { mdxBundle } from "~/utils/bundler.server";
import { missionContent } from "~/constants/page-content.server";

export const meta = metaFn;

export async function loader() {
  // const { code: content } = await mdxBundle({ source: missionContent });
  return json({ content: missionContent });
}

export default function Mission() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <Section className="flex flex-col items-center">
      <h1 className="text-2xl text-slate-800 dark:text-slate-100 mb-8 underline underline-offset-4">
        My Mission
      </h1>
      <div className="dark:text-slate-300 text-slate-600">
        <Markdown source={content} />
      </div>{" "}
      <Link to="/about">
        <button className="rounded-xl  text-xl p-4 my-8 border-2 border-slate-400 hover:border-slate-800 dark:hover:border-[#fff] flex items-center">
          <BsArrowRight
            className="text-xl inline animate-pulse mr-4"
            aria-label="learn more about CS"
          />
          <span>Learn more about Me.</span>
        </button>
      </Link>
    </Section>
  );
}
