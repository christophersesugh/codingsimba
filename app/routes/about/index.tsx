import type { Route } from "./+types/index";
import { Header } from "~/components/page-header";
import { Mission } from "./components/mission";
import { Impact } from "./components/impact";
import { Values } from "./components/values";
import { Journey } from "./components/journey";
import { Skills } from "./components/skills";
import { CTA } from "./components/cta";
import { readMdxDirectory } from "~/utils/misc.server";
import { invariantResponse } from "~/utils/misc";
import { StatusCodes } from "http-status-codes";
import { countArticles } from "~/utils/content.server/articles/utils";

export async function loader() {
  const articlesCount = countArticles();
  const files = await readMdxDirectory("about/journey");
  invariantResponse(files.length, "No files found", {
    status: StatusCodes.NOT_FOUND,
  });
  return { journeyData: files, articlesCount };
}

export default function AboutRoute({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Header
        title="Simba's Den of Nerdery"
        description="Passionate about coding, teaching, and building tools that make a difference."
      />
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Mission />
        <Journey journeyData={loaderData.journeyData} />
        <Impact articlesCount={loaderData.articlesCount} />
        <Skills />
        <Values />
        <CTA />
      </div>
    </>
  );
}
