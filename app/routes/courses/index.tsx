import { ArrowDownAZ } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import { Header } from "~/components/page-header.client";

export default function CoursesRoute() {
  return (
    <div>
      <Header
        title="Courses"
        description="Level up your skills with our comprehensive courses designed by industry experts."
        placeholder="Search for courses..."
        enableSearch
      />
      <div className="container mx-auto my-20 w-full max-w-3xl">
        <EmptyState
          icon={<ArrowDownAZ className="size-8" />}
          title="Coming soon!"
          description="Courses section is under construction"
        />
      </div>
    </div>
  );
}
