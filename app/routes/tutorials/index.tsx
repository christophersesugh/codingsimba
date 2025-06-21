import { ArrowDownAZ } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import { Header } from "~/components/page-header";

export default function TutorialsRoute() {
  return (
    <div>
      <Header
        title="Tutorials"
        description="Practical, hands-on tutorials to help you master specific technologies and concepts."
        placeholder="Search for tutorials..."
        enableSearch
      />
      <div className="container mx-auto my-20 w-full max-w-3xl">
        <EmptyState
          icon={<ArrowDownAZ className="size-8" />}
          title="New Tutorials Coming Soon!"
          description="We're currently developing new tutorials. While you wait, feel free to explore our articles and courses."
        />
      </div>
    </div>
  );
}
