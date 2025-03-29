import React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { AboutCard, AboutText } from "~/components/about";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="absolute left-0 top-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* <motion.div
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
                  src="https://placehold.co/400"
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
          </motion.div> */}
          <AboutCard />
          <AboutText />
        </div>
      </div>
    </section>
  );
}
