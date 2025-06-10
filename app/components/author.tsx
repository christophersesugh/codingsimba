import { ArrowBigRight } from "lucide-react";
import { Link } from "react-router";
import { SupportMeButton } from "~/components/ui/support-me-button";
import { Button } from "~/components/ui/button";

export function Author() {
  return (
    <div className="mb-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <img
          src={"/favicon.png"}
          alt={"Christopher S. Aondona"}
          width={80}
          height={80}
          className="hidden rounded-full sm:block"
        />
        <div>
          <h3 className="mb-2 text-lg font-black">
            <span className="text-gray-500"> Written by</span> Christopher S.
            Aondona <span className="text-gray-500">(Coding Simba)</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Rust/JavaScript software engineer. Building open-source tools for
            the modern web and teaching through code. Passionate about robust
            systems, community-driven development, and sharing knowledge. Always
            learning, always shipping.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <SupportMeButton />
            <Button aria-label="Learn more about me" asChild>
              <Link to="/about" prefetch="intent">
                Learn more
                <ArrowBigRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
