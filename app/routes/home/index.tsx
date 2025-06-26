import { HeroSection } from "./hero";
// import { CoursesSection } from "./courses";
// import { ArticlesSection } from "./articles";
// import { About } from "./about";
import { ContactSection } from "./contact";
import { NewsLetterSection } from "./news-letter";
import {
  countArticles,
  getRecentArticles,
} from "~/utils/content.server/articles/utils";
import { generateMetadata } from "~/utils/meta";
import { Subscription } from "./subscription";
import { FAQSection } from "./faqs";
import { readMdxDirectory } from "~/utils/misc.server";

export async function loader() {
  const articles = getRecentArticles();
  const articlesCount = countArticles();
  const faqs = readMdxDirectory("faqs");
  return { articles, articlesCount, faqs };
}

export default function HomeRoute() {
  return (
    <>
      {generateMetadata({})}
      <HeroSection />
      {/* <CoursesSection /> */}
      {/* <ArticlesSection /> */}
      <FAQSection />
      <Subscription />
      {/* <About /> */}
      <ContactSection />
      <NewsLetterSection />
    </>
  );
}
