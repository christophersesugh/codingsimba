import { ArrowDownAZ } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import { Header } from "~/components/page-header";

export default function TutorialsRoute() {
  return (
    <div>
      <Header
        title="tutorials"
        description="Practical, hands-on tutorials to help you master specific technologies and concepts."
        placeholder="Search for tutorials..."
        enableSearch
      />
      <div className="container mx-auto my-20 w-full max-w-3xl">
        <EmptyState
          icon={<ArrowDownAZ className="size-8" />}
          title="Coming soon!"
          description="Tutorials section is under construction"
        />
      </div>
    </div>
  );
}
