import React from "react";
import type { Route } from "./+types/index";
import { Await, Link, useLoaderData } from "react-router";
import { motion } from "framer-motion";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="absolute left-0 top-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <AboutCard />
          <AboutText />
        </div>
      </div>
    </section>
  );
}

function AboutCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-white blur-3xl dark:to-gray-950" />
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
          <img
            src="https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/6749aa161e69b57e6d39b2cd430834da255e31bd-1024x1024.png"
            alt="Coding Simba"
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
        <div className="absolute -left-6 -top-6 h-24 w-24 -rotate-3 transform rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 h-4 w-full rounded bg-blue-600 dark:bg-blue-500" />
          <div className="mb-2 h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </motion.div>
  );
}

function AboutText() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];
  const startYear = 2019;
  const experienceYears = new Date().getFullYear() - startYear;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="mb-6 text-xl font-bold md:text-2xl">
        <span className="text-gray-500">About</span> Christopher S. Aondona
        <span className="text-gray-500"> (Coding Simba)</span>
      </h2>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        I&apos;m a passionate software engineer with over {experienceYears}{" "}
        years of experience building the web, tools for the web, and teaching
        others to do the same.
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
            {experienceYears}+
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Years Experience
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            2
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Courses Created
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            <React.Suspense fallback={<Skeleton className="rounded-full" />}>
              <Await resolve={loaderData.articlesCount}>
                {(count) => count}
              </Await>
            </React.Suspense>
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

      <Button className="rounded-full px-8" asChild>
        <Link to={"about"}>Learn More</Link>
      </Button>
    </motion.div>
  );
}
