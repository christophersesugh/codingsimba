import type { InputHTMLAttributes } from "react";
import React from "react";
import clsx from "clsx";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function FormInput({ className, label, ...props }: FormInputProps) {
  return (
    <div className="w-full">
      <label htmlFor={props?.id} className="block">
        {label}
      </label>
      <input
        {...props}
        className={clsx("p-2 rounded-md w-full bg-slate-100", className)}
      />
    </div>
  );
}
