import { ArrowDownAZ } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { EmptyState } from "~/components/empty-state";
import { Button } from "~/components/ui/button";

export default function ProgramsRoute() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-13 border-b border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 dark:border-gray-800 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/30">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                Career-Focused Learning Paths
              </div>
              <h1 className="mb-6 text-3xl font-bold md:text-5xl lg:text-5xl">
                Choose Your{" "}
                <span className="text-blue-600 dark:text-blue-500">
                  Program
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                Structured learning paths designed to take you from beginner to
                job-ready professional. Each program combines multiple courses
                into a comprehensive curriculum.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="rounded-full px-8">
                  <Link to={"#programs"}>Explore Programs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="container mx-auto my-20 w-full max-w-3xl" id="programs">
        <EmptyState
          icon={<ArrowDownAZ className="size-8" />}
          title="New Programs Coming Soon!"
          description="We're currently developing new programs. While you wait, feel free to explore our tutorials and articles."
        />
      </div>
    </div>
  );
}
