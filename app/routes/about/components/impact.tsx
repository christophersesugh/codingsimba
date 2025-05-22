import React from "react";
import { Award, BookOpen, Users } from "lucide-react";
import { SectionHeader } from "./section-header";

export function Impact() {
  return (
    <section className="mb-24 rounded-2xl bg-gray-50 p-8 md:p-12 dark:bg-gray-900">
      <SectionHeader
        title="My Impact"
        description=" I'm proud of the impact I've had on the developer community.
          a glimpse of my journey so far."
      />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <Item icon={<Users className="h-8 w-8" />} count="10k+">
          Students
        </Item>
        <Item icon={<BookOpen className="h-8 w-8" />} count="50+">
          Courses
        </Item>
        <Item icon={<Award className="h-8 w-8" />} count="200+">
          Articles
        </Item>
        <Item
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          count="97%"
        >
          Satisfaction
        </Item>
      </div>
    </section>
  );
}

function Item({
  icon,
  count,
  children,
}: {
  icon: React.ReactNode;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
        {count}
      </div>
      <div className="text-gray-600 dark:text-gray-300">{children}</div>
    </div>
  );
}
