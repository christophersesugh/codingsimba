import clsx from "clsx";
import React from "react";

export function FormInput({
  className,
  type,
  name,
  id,
  ...props
}: {
  className?: string;
  // type?: string;
  // name?: string;
  // id?: string;
  // props: any;
}) {
  return (
    <div className="w-full">
      <input
        type="text"
        name={name}
        id={id}
        {...props}
        className={clsx("p-2 rounded-md w-full bg-slate-100", className)}
      />
    </div>
  );
}
