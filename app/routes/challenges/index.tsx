import { ArrowDownAZ, Zap, Trophy, Users, Code } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "~/components/empty-state";

export default function CoursesRoute() {
  return (
    <div>
      <div className="mt-13 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 py-12 dark:border-gray-800 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 flex items-center justify-center gap-2">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-4xl font-bold md:text-5xl">
                  Monthly Coding Challenges
                </h1>
              </div>
              <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                Test your skills with our monthly coding challenges in
                JavaScript, Typescript, and Rust. Compete with developers
                worldwide and level up your programming abilities.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 dark:bg-gray-900">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">
                    New challenges every month
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 dark:bg-gray-900">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Earn points and badges</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 dark:bg-gray-900">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Global leaderboard</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="container mx-auto my-20 w-full max-w-3xl">
        <EmptyState
          icon={<ArrowDownAZ className="size-8" />}
          title="New Challenges Coming Soon!"
          description="We're currently curating new challenges. While you wait, feel free to explore our articles and tutorials."
        />
      </div>
    </div>
  );
}
