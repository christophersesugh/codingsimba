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
import { Markdown } from "~/components/mdx";

type JourneyProps = {
  slug: string;
  content: string;
  frontmatter: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

export function Journey({ journeyData }: { journeyData: JourneyProps[] }) {
  return (
    <section className="mb-24">
      <SectionHeader
        title="My Journey"
        description=" Key moments and milestones that have shaped my path as a developer and
          educator."
      />
      <div className="mx-auto grid auto-rows-auto grid-cols-1 gap-3 md:grid-cols-3">
        {journeyData.map((item, index) => (
          <GridItem key={item.slug} index={index} journeyItem={item} />
        ))}
      </div>
    </section>
  );
}

function GridItem({
  index,
  journeyItem,
}: {
  index: number;
  journeyItem: JourneyProps;
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
  const frontmatter = journeyItem.frontmatter;
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{frontmatter.title}</DialogTitle>
        </DialogHeader>
        <div className="-my-6">
          <Markdown source={journeyItem.content} />
        </div>
      </DialogContent>
      <DialogTrigger
        className={cn(
          gridClasses,
          "transform text-left transition-all duration-300 hover:scale-105 hover:shadow-lg",
        )}
      >
        <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-800 dark:bg-gray-900">
          {frontmatter?.hasImage && (
            <div className="w-full">
              {" "}
              <img
                src={frontmatter.image}
                alt={frontmatter.title}
                className="aspect-video h-36 w-full object-fill"
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
                {frontmatter.category}
              </Badge>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                {" "}
                <Calendar className="mr-1 h-2.5 w-2.5" />
                {frontmatter.year}
              </div>
            </div>
            <h3 className="mb-1 text-base font-bold">{frontmatter.title}</h3>{" "}
            <p className="flex-grow text-sm text-gray-600 dark:text-gray-400">
              {frontmatter.description}
            </p>{" "}
            <div className="mt-2 flex justify-end">
              {" "}
              <div className="flex h-auto items-center p-0 text-xs text-blue-600 dark:text-blue-400">
                Read more <ArrowRight className="ml-1 h-2.5 w-2.5" />{" "}
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
    </Dialog>
  );
}
