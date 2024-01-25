import clsx from "clsx";
import { Link } from "@remix-run/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Button } from "./ui/button";

type BackButtonProps = {
  to: string;
  text: string;
  className?: string;
};

export function BackButton({ to, text, className }: BackButtonProps) {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
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
