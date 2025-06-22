import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function CTA() {
  return (
    <section className="rounded-2xl bg-blue-50 p-8 md:p-12 dark:bg-blue-950/30">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Join thousands of developers who are already improving their skills
          with our courses and tutorials.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/courses">
            <Button size="lg" className="rounded-full px-8">
              Explore Courses
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
