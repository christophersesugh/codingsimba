import React from "react";
import { HeroSection } from "./hero";
import { CoursesSection } from "./courses";
import { ArticlesSection } from "./articles";
import { About } from "./about";
import { ContactSection } from "./contact";
import { NewsLetterSection } from "./news-letter";

export default function HomeRoute() {
  return (
    <>
      <HeroSection />
      <CoursesSection />
      <ArticlesSection />
      <About />
      <ContactSection />
      <NewsLetterSection />
    </>
  );
}
