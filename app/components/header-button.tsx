import React from "react";
import { Link } from "@remix-run/react";
import { BsArrowDown } from "react-icons/bs";
import { Button } from "./button";

interface HeaderButtonProps {
  to: string;
  buttonText: string;
  icon?: React.ReactNode;
  otherProps?: React.ReactNode;
}

export function HeaderButton({
  to,
  buttonText,
  icon,
  otherProps,
}: HeaderButtonProps) {
  return (
    <div>
      {otherProps ? otherProps : null}
      <div className="flex items-center gap-6 mt-12">
        <Link to={to}>
          <Button className="!rounded-full  text-xl p-4  border-2 border-slate-400 hover:border-slate-800 dark:hover:border-[#fff]">
            {icon ? icon : <BsArrowDown className="text-lg animate-bounce" />}
          </Button>
        </Link>
        <span className="text-lg">{buttonText}</span>
      </div>
    </div>
  );
}
