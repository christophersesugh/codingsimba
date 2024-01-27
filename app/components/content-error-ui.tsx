import { FiAlertCircle } from "react-icons/fi";
import { cn } from "~/utils/shadcn";

interface CEUIProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  className?: string;
}

export function ContentErrorUI({ error, className }: CEUIProps) {
  return (
    <div className="max-w-3xl bg-red-100 rounded-md mx-auto p-6 my-6">
      <h2
        className={cn(
          "text-4xl capitalize font-black py-8 flex flex-col gap-6 items-center justify-center",
          className,
        )}
      >
        <FiAlertCircle
          className={cn("inline mr-2 text-[7rem] text-red-400", className)}
        />{" "}
        <span className="text-red-500">Error!</span>
        <span className="text-red-500 text-lg">
          {error && error.message ? error.message : "Unknown error."}
        </span>
      </h2>
    </div>
  );
}
