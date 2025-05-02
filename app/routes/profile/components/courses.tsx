import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function Courses() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=200&width=200&text=JD",
    bio: "Frontend developer passionate about React and modern JavaScript.",
    location: "San Francisco, CA",
    joinDate: "January 2023",
    courses: [
      {
        id: "modern-react",
        title: "Modern React Development",
        progress: 75,
        lastAccessed: "2 days ago",
        image: "/placeholder.svg?height=80&width=120&text=React",
      },
      {
        id: "advanced-typescript",
        title: "Advanced TypeScript",
        progress: 45,
        lastAccessed: "1 week ago",
        image: "/placeholder.svg?height=80&width=120&text=TypeScript",
      },
      {
        id: "fullstack-nextjs",
        title: "Full-Stack Next.js",
        progress: 10,
        lastAccessed: "3 days ago",
        image: "/placeholder.svg?height=80&width=120&text=Next.js",
      },
    ],
    certificates: [
      {
        id: "react-fundamentals",
        title: "React Fundamentals",
        issueDate: "March 15, 2023",
        image: "/placeholder.svg?height=80&width=120&text=Certificate",
      },
      {
        id: "javascript-advanced",
        title: "Advanced JavaScript",
        issueDate: "February 10, 2023",
        image: "/placeholder.svg?height=80&width=120&text=Certificate",
      },
    ],
    subscription: {
      plan: "Pro",
      status: "Active",
      renewDate: "January 15, 2024",
      price: "$19.99/month",
    },
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-bold">My Courses</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {user.courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 md:flex-row md:items-center dark:border-gray-800 dark:hover:bg-gray-800"
              >
                <div className="w-full md:w-auto">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-bold">{course.title}</h3>
                  <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Last accessed {course.lastAccessed}</span>
                  </div>
                  <div className="mb-1 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {course.progress}% complete
                  </div>
                </div>
                <div>
                  <Link to={`/courses/${course.id}`}>
                    <Button>Continue Learning</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
