import { Link, useLoaderData } from "@remix-run/react";
import { BsArrowRight } from "react-icons/bs";
import { metaFn } from "~/utils/meta";
import { json } from "@remix-run/node";
import { getPage } from "~/utils/page.server";
import { Container } from "~/components/container";
import { Markdown } from "~/components/mdx";

export const meta = metaFn;

export async function loader() {
  const content = getPage("mission");
  return json({ content });
}

export default function Mission() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col items-center">
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
    </Container>
  );
}
