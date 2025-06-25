import React, { useEffect, useState, useRef } from "react";
import { Award, BookOpen, Users, TrendingUp } from "lucide-react";
import { SectionHeader } from "./section-header";
import { Await } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/utils/misc";

export function Impact({ articlesCount }: { articlesCount: Promise<number> }) {
  return (
    <section className="mb-24">
      <SectionHeader
        title="Our Impact"
        description="We're proud of the impact we've had on the developer community. Here's a glimpse of our journey so far."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ImpactCard
          icon={<Users className="h-6 w-6" />}
          count={1000}
          label="Students"
          description="Active learners"
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />

        <ImpactCard
          icon={<BookOpen className="h-6 w-6" />}
          count={50}
          label="Courses"
          description="Comprehensive content"
          gradient="from-purple-500 to-pink-500"
          delay={100}
        />

        <React.Suspense fallback={<ImpactCardSkeleton />}>
          <Await resolve={articlesCount}>
            {(count) => (
              <ImpactCard
                icon={<Award className="h-6 w-6" />}
                count={count}
                label="Articles"
                description="Published content"
                gradient="from-green-500 to-emerald-500"
                delay={200}
              />
            )}
          </Await>
        </React.Suspense>

        <ImpactCard
          icon={<TrendingUp className="h-6 w-6" />}
          count={97}
          label="Satisfaction"
          description="Student satisfaction"
          gradient="from-orange-500 to-red-500"
          delay={300}
          suffix="%"
          showProgress={true}
        />
      </div>
    </section>
  );
}

function ImpactCard({
  icon,
  count,
  label,
  description,
  gradient,
  delay,
  suffix = "",
  showProgress = false,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  description: string;
  gradient: string;
  delay: number;
  suffix?: string;
  showProgress?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = count / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= count) {
          setDisplayCount(count);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, count]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900",
        isVisible && "animate-in fade-in-0 slide-in-from-bottom-4",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-300 group-hover:opacity-10",
          gradient,
        )}
      />

      <div
        className={cn(
          "relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-lg",
          gradient,
        )}
      >
        {icon}
      </div>

      <div className="relative mb-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {displayCount.toLocaleString()}
        </span>
        {suffix && (
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {suffix}
          </span>
        )}
      </div>

      <h3 className="relative mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        {label}
      </h3>

      <p className="relative text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>

      {showProgress && (
        <div className="relative mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {count}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
                gradient,
              )}
              style={{
                width: isVisible ? `${count}%` : "0%",
                transitionDelay: `${delay + 500}ms`,
              }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/0 dark:to-black/5" />
    </div>
  );
}

function ImpactCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Skeleton className="mb-4 h-12 w-12 rounded-lg" />
      <Skeleton className="mb-2 h-8 w-20" />
      <Skeleton className="mb-1 h-6 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
