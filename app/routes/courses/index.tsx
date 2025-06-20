import { ArrowDownAZ } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import { Header } from "~/components/page-header";

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
          title="New Courses Coming Soon!"
          description="We're currently developing new courses. While you wait, feel free to explore our articles and tutorials."
        />
      </div>
    </div>
  );
}
