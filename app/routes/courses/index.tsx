import { ArrowDownAZ } from "lucide-react";
import { EmptyState } from "~/components/empty-state";

export default function CoursesRoute() {
  return (
    <div className="container mx-auto mb-20 mt-40 w-full max-w-3xl">
      <EmptyState
        icon={<ArrowDownAZ className="size-8" />}
        title="Coming soon!"
        description="This page is under construction"
      />
    </div>
  );
}
