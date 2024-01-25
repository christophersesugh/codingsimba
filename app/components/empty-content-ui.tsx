import { FiAlertCircle } from "react-icons/fi";
import { cn } from "~/utils/shadcn";

interface ECUIProps {
  message: string;
  className?: string;
}

export function EmptyContentUI({ message, className }: ECUIProps) {
  return (
    <h2
      className={cn(
        "text-4xl capitalize text-slate-400 font-black py-8 flex flex-col items-center justify-center",
        className,
      )}
    >
      <FiAlertCircle
        className={cn("inline mr-2 text-[7rem] text-slate-300 mb-4", className)}
      />{" "}
      <span>{message}</span>
    </h2>
  );
}
