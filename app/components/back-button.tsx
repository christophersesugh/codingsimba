import React from "react";
import { Link } from "@remix-run/react";
import { Button } from "./button";
import { AiOutlineArrowLeft } from "react-icons/ai";
import clsx from "clsx";

type BackButtonProps = {
  to: string;
  text: string;
  className?: string;
};

export function BackButton({ to, text, className }: BackButtonProps) {
  return (
    <Link to={to}>
      <Button
        className={clsx(
          "flex items-center self-start text-lg font-extrabold capitalize",
          className,
        )}
      >
        <AiOutlineArrowLeft className="mr-2 inline" />
        {text}
      </Button>
    </Link>
  );
}
