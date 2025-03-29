import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export function AboutText() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="mb-6 text-3xl font-bold md:text-4xl">
        About Coding Simba
      </h2>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        I&apos;m a passionate software engineer with over 10 years of experience
        building web applications and teaching others to do the same.
      </p>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        My mission is to make complex programming concepts accessible to
        everyone, regardless of their background or experience level.
      </p>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Through my courses and articles, I&apos;ve helped thousands of
        developers level up their skills and build amazing projects.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            5+
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Years Experience
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            2+
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Courses Created
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            3+
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Articles Written
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            1k+
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Students Taught
          </span>
        </div>
      </div>

      <Button className="rounded-full px-8">Learn More</Button>
    </motion.div>
  );
}
