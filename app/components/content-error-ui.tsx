import React from "react";
import clsx from "clsx";
import { FiAlertCircle } from "react-icons/fi";

interface CEUIProps {
  error: any;
  className?: string;
}

export function ContentErrorUI({ error, className }: CEUIProps) {
  return (
    <h2
      className={clsx(
        "text-4xl capitalize font-black py-8 flex flex-col gap-6 items-center justify-center",
        className,
      )}
    >
      <FiAlertCircle
        className={clsx("inline mr-2 text-[7rem] text-red-300", className)}
      />{" "}
      <span className="text-red-500">Error!</span>
      <span className="text-red-500 text-lg">{error?.message}</span>
    </h2>
  );
}
