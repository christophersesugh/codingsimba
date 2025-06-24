import type { Route } from "./+types/index";
import { Header } from "~/components/page-header";
import { Mission } from "./components/mission";
import { Impact } from "./components/impact";
import { Values } from "./components/values";
import { Journey } from "./components/journey";
import { Skills } from "./components/skills";
import { Team } from "./components/team";
import { CTA } from "./components/cta";
import { countArticles } from "~/utils/content.server/articles/utils";
import { readMdxDirectory } from "~/utils/misc.server";
import { generateMetadata } from "~/utils/meta";

export async function loader() {
  const articlesCount = countArticles();
  const journeyData = readMdxDirectory("about/journey");

  return { articlesCount, journeyData };
}

export default function AboutRoute({ loaderData }: Route.ComponentProps) {
  const title = "About Coding Simba";
  const metadata = generateMetadata({ title });
  return (
    <>
      {metadata}
      <Header
        title={title}
        description="We are passionate about coding, teaching, and building tools that make a difference for individuals and organizations."
      />
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Mission />
        <Impact articlesCount={loaderData.articlesCount} />
        <Journey journeyData={loaderData.journeyData} />
        <Skills />
        <Team />
        <Values />
        <CTA />
      </div>
    </>
  );
}
