import React from "react";
import { HeroSection } from "./hero";
import { CoursesSection } from "./courses";
// import { ArticlesSection } from "./articles";
import { About } from "./about";
import { ContactSection } from "./contact";
import { NewsLetterSection } from "./news-letter";
import { getRecentArticles } from "~/services.server/sanity/articles";
// import type { Route } from "./+types";

export async function loader() {
  const { data: articles } = await getRecentArticles();
  return { articles };
}

export default function HomeRoute() {
  // { loaderData }: Route.ComponentProps
  // const { articles } = loaderData;
  return (
    <>
      <HeroSection />
      <CoursesSection />
      {/* <ArticlesSection articles={articles} /> */}
      <About />
      <ContactSection />
      <NewsLetterSection />
    </>
  );
}
