import { cn } from "~/lib/shadcn";
import { SectionHeader } from "./section-header";
import { Badge } from "~/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function Journey() {
  return (
    <section className="mb-24">
      <SectionHeader
        title="My Journey"
        description=" Key moments and milestones that have shaped my path as a developer and
          educator."
      />
      <div className="mx-auto grid auto-rows-auto grid-cols-1 gap-3 md:grid-cols-3">
        {journeyData.map((item, index) => (
          <GridItem key={item.id} index={index} item={item} />
        ))}
      </div>
    </section>
  );
}

function GridItem({
  index,
  item,
}: {
  index: number;
  item: (typeof journeyData)[0];
}) {
  const layoutPattern = [
    "col-span-2 md:col-span-1",
    "col-span-2 md:col-span-1",
    "col-span-2 md:col-span-1 md:row-span-2",
    "col-span-2 md:col-span-2",
    "col-span-2 md:col-span-1 lg:row-span-3",
    "col-span-2 md:col-span-2",
    "col-span-2 md:col-span-1 md:row-span-2",
    "col-span-2 md:col-span-1 md:row-span-2",
  ];

  const gridClasses = layoutPattern[index % layoutPattern.length] || "";

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          {/* <DialogDescription>{item.fullDescription}</DialogDescription> */}
        </DialogHeader>
        {item.fullDescription}
      </DialogContent>
      <DialogTrigger
        className={cn(
          gridClasses,
          "transform text-left transition-all duration-300 hover:scale-105 hover:shadow-lg",
        )}
      >
        {/* <div
          className={cn(
            gridClasses,
            "transform transition-all duration-300 hover:scale-105 hover:shadow-lg",
          )}
        > */}
        <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-800 dark:bg-gray-900">
          {item?.hasImage && (
            <div className="w-full">
              {" "}
              <img
                src={item.image}
                alt={item.title}
                className="h-36 w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-grow flex-col p-3">
            {" "}
            <div className="mb-1 flex items-start justify-between">
              {" "}
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 px-1.5 py-0 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300" /* Smaller badge */
              >
                {item.category}
              </Badge>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                {" "}
                <Calendar className="mr-1 h-2.5 w-2.5" />
                {item.year}
              </div>
            </div>
            <h3 className="mb-1 text-base font-bold">{item.title}</h3>{" "}
            <p className="flex-grow text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>{" "}
            <div className="mt-2 flex justify-end">
              {" "}
              <div className="flex h-auto items-center p-0 text-xs text-blue-600 dark:text-blue-400">
                Read more <ArrowRight className="ml-1 h-2.5 w-2.5" />{" "}
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </DialogTrigger>
    </Dialog>
  );
}

const journeyData = [
  {
    id: 1,
    title: "First Line of Code",
    description: "Where it all began — my first HTML page.",
    year: "2019",
    category: "Milestone",
    fullDescription: `A humble "Hello World" in HTML marked the start of my coding journey.`,
  },
  {
    id: 2,
    title: "First Developer Role",
    description: "Front-End Developer @ FinAxis",
    year: "2020",
    category: "Career",
    fullDescription: `Landed my first professional role, building [specific projects/tools] with [technologies].`,
  },
  {
    id: 3,
    title: "Personal",
    description:
      "Christopher Sesugh Aondona (Coding Simba) — Developer & Educator",
    hasImage: true,
    image: "/favicon.png",
    year: "1901",
    category: "Personal",
    fullDescription: `The human behind the code. Passionate about teaching and building tools that solve problems.`,
  },
  {
    id: 4,
    title: "Started Teaching",
    description:
      "Began teaching (professionally) at KodeCamp (powered by KodeHauz)",
    year: "2023",
    category: "Milestone",
    fullDescription: `Transitioned to mentoring aspiring developers, specializing in [subjects].`,
  },
  {
    id: 5,
    title: "First Open Source Contribution",
    description:
      "Began my open-source journey with a small README edit - the first step to bigger contributions.",
    hasImage: true,
    image: "/favicon.png",
    year: "2024",
    category: "Achievement",
    fullDescription: `Submitted a PR to fix a documentation typo — small start, big lessons in collaboration.`,
  },
  {
    id: 6,
    title: "Technology Stack",
    description: "Core stack: HTML, CSS, TypeScript, Rust, React, Node.js",
    year: "01BC",
    category: "Skills",
    fullDescription: `Tailwind<br/>
    CSS
    React
    Node.js`,
  },
  {
    id: 7,
    title: "First NPM Package",
    description: "Published use-toc on NPM",
    year: "2025",
    category: "Achievement",
    fullDescription: `A [tool/library] to solve [problem]. Downloads: [X] (if notable).`,
  },
  {
    id: 9,
    title: "Launched This Website",
    description: "Built my teaching platform",
    year: "2025",
    category: "Project",
    fullDescription: `Designed to share knowledge with [audience]. Built with [tech stack].`,
  },
];
