import { AboutCard, AboutText } from "~/components/about";

export function About({
  articlesCount,
}: {
  articlesCount: Promise<{ count: number }>;
}) {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="absolute left-0 top-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <AboutCard />
          <AboutText articlesCount={articlesCount} />
        </div>
      </div>
    </section>
  );
}
