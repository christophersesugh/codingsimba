import { ArrowDownAZ } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import { Header } from "~/components/page-header";

export default function ProgramsRoute() {
  return (
    <div>
      <Header
        title="Programs"
        description="Structured learning paths designed to take your skills to the next level."
        placeholder="Search for programs..."
        enableSearch
      />
      <div className="container mx-auto my-20 w-full max-w-3xl">
        <EmptyState
          icon={<ArrowDownAZ className="size-8" />}
          title="New Programs Coming Soon!"
          description="We're currently developing new programs. While you wait, feel free to explore our courses and articles."
        />
      </div>
    </div>
  );
}
