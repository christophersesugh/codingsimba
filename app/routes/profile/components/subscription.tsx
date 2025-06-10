/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArrowDownAZ, ChevronRight } from "lucide-react";
import { EmptyState } from "~/components/empty-state";

export function Subscription() {
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
      <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-bold">Subscription Details</h2>
        </div>
        <div className="p-6">
          <EmptyState
            icon={<ArrowDownAZ className="size-8" />}
            title="Not Implemented!"
            description="We are working to implement this feature."
          />
          {/* <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {user.subscription.plan} Plan
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {user.subscription.price}
                </div>
              </div>
              <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                {user.subscription.status}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="font-medium">Next billing date</div>
              <div>{user.subscription.renewDate}</div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="font-medium">Payment method</div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-8 w-8"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="8" fill="#1A1F36" />
                  <path
                    d="M19.5 24.5H27.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23.5 20.5H27.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.5 16.5H27.51"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 24.5C16.7091 24.5 18.5 22.7091 18.5 20.5C18.5 18.2909 16.7091 16.5 14.5 16.5C12.2909 16.5 10.5 18.2909 10.5 20.5C10.5 22.7091 12.2909 24.5 14.5 24.5Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>•••• 4242</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Billing history</div>
              <Button variant="link" className="h-auto p-0">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div> */}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-bold">Manage Subscription</h2>
        </div>
        <div className="p-6">
          <EmptyState
            icon={<ArrowDownAZ className="size-8" />}
            title="Not Implemented!"
            description="We are working to implement this feature."
          />
          {/* <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-800">
                <h3 className="mb-2 text-lg font-bold">Basic</h3>
                <div className="mb-2 text-3xl font-bold">$9.99</div>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  per month
                </div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Access to basic courses</li>
                  <li>Limited downloads</li>
                  <li>No certificate</li>
                  <li>Email support</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Downgrade
                </Button>
              </div>
              <div className="relative rounded-lg border-2 border-blue-600 p-6 text-center dark:border-blue-500">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  Current Plan
                </div>
                <h3 className="mb-2 text-lg font-bold">Pro</h3>
                <div className="mb-2 text-3xl font-bold">$19.99</div>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  per month
                </div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Access to all courses</li>
                  <li>Unlimited downloads</li>
                  <li>Certificates included</li>
                  <li>Priority email support</li>
                </ul>
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              </div>
              <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-800">
                <h3 className="mb-2 text-lg font-bold">Team</h3>
                <div className="mb-2 text-3xl font-bold">$49.99</div>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  per month
                </div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Access for 5 team members</li>
                  <li>Unlimited downloads</li>
                  <li>Certificates included</li>
                  <li>24/7 phone support</li>
                </ul>
                <Button className="w-full">Upgrade</Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Cancel Subscription
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
}
