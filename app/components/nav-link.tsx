import { NavLink as NLink } from "react-router";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

type NavLinkProps = {
  name: string;
  path: string;
  type?: string;
  onClick?: () => void;
};

export function NavLink({
  path,
  name,
  type = "footer",
  onClick,
}: NavLinkProps) {
  return (
    <Button
      variant={"link"}
      onClick={onClick}
      className={cn(
        "m-0 p-0 capitalize text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
        { "text-lg": type === "navbar" },
      )}
    >
      <NLink
        className={({ isActive }) =>
          isActive ? "underline dark:text-white" : ""
        }
        prefetch="intent"
        to={path}
      >
        {name}
      </NLink>
    </Button>
  );
}
