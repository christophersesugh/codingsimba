import { HeroSection } from "./hero";
import { CoursesSection } from "./courses";
import { ArticlesSection } from "./articles";
// import { About } from "./about";
import { ContactSection } from "./contact";
import { NewsLetterSection } from "./news-letter";
import {
  countArticles,
  getRecentArticles,
} from "~/utils/content.server/articles/utils";
import { generateMetadata } from "~/utils/meta";

export async function loader() {
  const articles = getRecentArticles();
  const articlesCount = countArticles();
  return { articles, articlesCount };
}

export default function HomeRoute() {
  return (
    <>
      {generateMetadata({})}
      <HeroSection />
      <CoursesSection />
      <ArticlesSection />
      {/* <About /> */}
      <ContactSection />
      <NewsLetterSection />
    </>
  );
}
