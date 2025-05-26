import React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { slogan } from "~/constants/navlinks";

export function HeroText() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      >
        {slogan}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
      >
        Level up your{" "}
        <span className="text-blue-600 dark:text-blue-500">coding skills</span>{" "}
        with expert guidance
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mb-8 text-xl text-gray-600 dark:text-gray-300"
      >
        Practical tutorials, in-depth courses, and real-world insights to help
        you become a better developer.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button
          asChild
          size="lg"
          className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 hover:from-blue-700 hover:to-blue-600 dark:text-white"
        >
          <Link to={"/courses"} prefetch="intent">
            Explore Courses
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-blue-200 px-8 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
        >
          <Link to={"/articles"} prefetch="intent">
            {" "}
            Read Articles
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-12 flex items-center gap-2"
      >
        <div className="flex -space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 overflow-hidden rounded-full border-2 border-slate-400 dark:border-gray-900"
            >
              <img
                src="https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/252788fa66eda851b93b61ec9701706f0f8014b1-65x59.jpg"
                alt={`User ${i}`}
                width={32}
                height={32}
              />
            </div>
          ))}
        </div>
        <div className="text-sm">
          <span className="font-bold text-blue-600 dark:text-blue-500">
            1,000+
          </span>{" "}
          developers already learning
        </div>
      </motion.div>
    </motion.div>
  );
}
