import React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { CourseCard } from "~/components/course-card";
import { Link } from "react-router";

export function CoursesSection() {
  return (
    <section id="courses" className="relative overflow-hidden py-24">
      <div className="absolute right-0 top-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive courses designed to take your skills to the next
            level.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="rounded-full px-8">
            <Link to={"/courses"} prefetch="intent">
              View All Courses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const courses = [
  {
    title: "Modern React Development",
    description: "Master React with hooks, context, and modern patterns",
    image: "/placeholder.svg?height=200&width=400&text=React",
    level: "Intermediate",
    lessons: 42,
    duration: "8 hours",
    price: "$79",
    tag: "Bestseller",
  },
  {
    title: "Advanced TypeScript",
    description: "Take your TypeScript skills to the next level",
    image: "/placeholder.svg?height=200&width=400&text=TypeScript",
    level: "Advanced",
    lessons: 36,
    duration: "6.5 hours",
    price: "$89",
    tag: "New",
  },
  {
    title: "Full-Stack Next.js",
    description: "Build complete applications with Next.js and modern tools",
    image: "/placeholder.svg?height=200&width=400&text=Next.js",
    level: "Intermediate",
    lessons: 54,
    duration: "10 hours",
    price: "$99",
    tag: "Popular",
  },
];
