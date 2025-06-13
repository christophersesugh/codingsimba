import React from "react";
import * as E from "@react-email/components";
import { Header } from "./header";
import { Footer } from "./footer";

export default function Welcome({ name }: { name: string }) {
  return (
    <>
      <Header />
      <E.Section className="mb-[32px]">
        <E.Heading className="mb-[16px] text-[24px] font-bold text-white">
          Welcome to the pride, {name}! 🎉
        </E.Heading>
        <E.Text className="mb-[16px] text-[16px] leading-[24px] text-gray-300">
          Congratulations on taking the first step towards mastering your coding
          skills! Your registration was successful, and we&apos;re thrilled to
          have you join our community of passionate learners and developers.
        </E.Text>
        <E.Text className="mb-[24px] text-[16px] leading-[24px] text-gray-300">
          At Coding Simba, we believe that everyone has the potential to become
          a great developer. Whether you&apos;re a complete beginner or looking
          to level up your existing skills, we&apos;ve got you covered with our
          comprehensive courses and hands-on projects.
        </E.Text>
      </E.Section>

      {/* Get Started Button */}
      <E.Section className="mb-[32px] text-center">
        <E.Button
          href="https://codingsimba.com/dashboard"
          className="box-border rounded-[8px] border border-gray-600 bg-gray-700 px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline hover:bg-gray-600"
        >
          Start Learning Now
        </E.Button>
      </E.Section>

      {/* What's Next */}
      <E.Section className="mb-[32px]">
        <E.Heading className="mb-[16px] text-[20px] font-bold text-white">
          What&apos;s next? 🚀
        </E.Heading>

        <E.Text className="mb-[12px] text-[16px] leading-[24px] text-gray-300">
          <strong className="text-gray-200">1. Complete your profile:</strong>{" "}
          Add your learning goals and preferences to get personalized course
          recommendations.
        </E.Text>
        <E.Text className="mb-[12px] text-[16px] leading-[24px] text-gray-300">
          <strong className="text-gray-200">2. Explore our courses:</strong>{" "}
          Browse through our extensive library of programming languages,
          frameworks, and technologies.
        </E.Text>
        <E.Text className="mb-[12px] text-[16px] leading-[24px] text-gray-300">
          <strong className="text-gray-200">3. Join the community:</strong>{" "}
          Connect with fellow learners, ask questions, and share your progress
          in our discussion forums.
        </E.Text>
        <E.Text className="mb-[16px] text-[16px] leading-[24px] text-gray-300">
          <strong className="text-gray-200">4. Start coding:</strong> Jump into
          your first lesson and begin building real projects from day one!
        </E.Text>
      </E.Section>

      {/* Features Highlight */}
      <E.Section className="mb-[32px] rounded-[8px] border border-gray-700 bg-gray-800 p-[24px]">
        <E.Heading className="mb-[16px] text-[18px] font-bold text-white">
          What makes Coding Simba special? ✨
        </E.Heading>
        <E.Text className="mb-[8px] text-[14px] leading-[20px] text-gray-300">
          • Interactive coding exercises and real-world projects
        </E.Text>
        <E.Text className="mb-[8px] text-[14px] leading-[20px] text-gray-300">
          • Expert instructors with industry experience
        </E.Text>
        <E.Text className="mb-[8px] text-[14px] leading-[20px] text-gray-300">
          • Progress tracking
        </E.Text>
        <E.Text className="mb-[8px] text-[14px] leading-[20px] text-gray-300">
          • 24/7 community support and mentorship
        </E.Text>
        <E.Text className="text-[14px] leading-[20px] text-gray-300">
          • Certificate of completion for finished courses
        </E.Text>
      </E.Section>

      {/* Support */}
      <E.Section className="mb-[32px]">
        <E.Text className="mb-[16px] text-[16px] leading-[24px] text-gray-300">
          Need help getting started? Our support team is here for you! Feel free
          to reach out at{" "}
          <E.Link
            href="mailto:support@codingsimba.com"
            className="text-gray-400 underline hover:text-gray-300"
          >
            support@codingsimba.com
          </E.Link>
          .
        </E.Text>
      </E.Section>
      <E.Hr className="my-[32px] border-gray-700" />
      <Footer />
    </>
  );
}
