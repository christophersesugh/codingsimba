import React from "react";
import type { Route } from "./+types";
import { HeroSection } from "./hero";
import { CoursesSection } from "./courses";
import { ArticlesSection } from "./articles";
import { About } from "./about";
import { ContactSection } from "./contact";
import { NewsLetterSection } from "./news-letter";
import {
  countArticles,
  getRecentArticles,
} from "~/services.server/sanity/articles/utils";

export async function loader() {
  const articles = getRecentArticles();
  const articlesCount = countArticles();
  return { articles, articlesCount };
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  const { articles, articlesCount } = loaderData;
  return (
    <>
      <HeroSection />
      <CoursesSection />
      <ArticlesSection articles={articles} />
      <About articlesCount={articlesCount} />
      <ContactSection />
      <NewsLetterSection />
    </>
  );
}
