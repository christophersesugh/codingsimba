import type { Route } from "./+types/index";
import { Suspense } from "react";
import { Await } from "react-router";
import { Roadmap } from "./components/roadmap";
import { RoadmapSkeleton } from "./components/roadmap-skeleton";
import { getRoadmapData } from "./roadmap.server";
import { Header } from "~/components/page-header";

export async function loader() {
  return {
    roadmapData: getRoadmapData(),
  };
}

export default function RoadmapPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Header
        title="Development Roadmap"
        description="Our comprehensive roadmap for building the ultimate learning platform."
      />
      <div className="container mx-auto px-4 py-8">
        {/* <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Development Roadmap
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Our comprehensive roadmap for building the ultimate learning platform.
          Follow our journey as we develop articles, tutorials, challenges,
          courses, and programs.
        </p>
      </div> */}

        <Suspense fallback={<RoadmapSkeleton />}>
          <Await resolve={loaderData.roadmapData}>
            {(roadmapData) => <Roadmap roadmapData={roadmapData} />}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
