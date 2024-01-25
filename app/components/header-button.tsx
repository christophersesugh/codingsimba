import React from "react";
import { Link } from "@remix-run/react";
import { BsArrowDown } from "react-icons/bs";
import { Button } from "./ui/button";

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
  ...props
}: HeaderButtonProps) {
  return (
    <div>
      {otherProps ? otherProps : null}
      <div className="flex items-center gap-6 mt-12">
        <Link to={to}>
          <Button
            variant="ghost"
            {...props}
            className="!rounded-md  text-xl p-4  border-2"
          >
            {icon ? icon : <BsArrowDown className="text-lg animate-bounce" />}
          </Button>
        </Link>
        <span className="text-lg">{buttonText}</span>
      </div>
    </div>
  );
}
