import {
  ExploreButton,
  HeroText,
  HeroBackground,
  HeroCard,
} from "./components/hero";
import { Navbar } from "~/components/navbar";

export function HeroSection() {
  return (
    <header className="relative flex min-h-screen flex-col items-start justify-start overflow-hidden">
      <HeroBackground />
      <div className="z-20 mb-12 w-full md:mb-20">
        <Navbar />
      </div>
      <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 md:grid-cols-2">
        <HeroText />
        <HeroCard />
      </div>
      <ExploreButton />
    </header>
  );
}
