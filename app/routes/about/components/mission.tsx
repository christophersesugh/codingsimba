import React from "react";
import { CheckCircle } from "lucide-react";
import cs from "../../../assets/images/cs.png";

export function Mission() {
  return (
    <section>
      <div className="mb-24 grid items-center gap-12 md:grid-cols-2">
        <div className="text-lg text-gray-800 dark:text-gray-300">
          <h2 className="mb-6 text-3xl font-bold">My Mission</h2>
          <p className="mb-6">
            I believe that programming knowledge should be accessible to
            everyone. My goal is to break down complex concepts into
            understandable pieces that anyone can learn, regardless of their
            background.
          </p>
          <p className="mb-6">
            Through my courses, tutorials, and articles, I&apos;ve helped
            thousands of developers improve their skills and build amazing
            projects. I focus on practical, real-world applications so you can
            apply what you learn immediately in your own work.
          </p>
          <div className="space-y-4">
            <ListItem>
              Making complex concepts accessible to learners of all levels
            </ListItem>
            <ListItem>
              Creating high-quality, up-to-date educational content
            </ListItem>
            <ListItem>Building a supportive community of developers</ListItem>
            <ListItem>
              Empowering students to build real-world projects
            </ListItem>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-white blur-3xl dark:to-gray-950" />
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <img
                src={cs}
                alt="Christopher S. Aondona"
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rotate-6 transform rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-2 h-4 w-3/4 rounded bg-blue-600 dark:bg-blue-500" />
              <div className="mb-2 h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start">
      <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
      <p className="text-gray-800 dark:text-gray-300">{children}</p>
    </div>
  );
}
