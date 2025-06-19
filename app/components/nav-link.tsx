import { NavLink as NLink } from "react-router";
import { cn } from "~/lib/shadcn";

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
    <NLink
      prefetch="intent"
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "m-0 p-0 capitalize text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
          { "text-lg": type === "navbar" },
          isActive ? "underline dark:text-white" : "",
        )
      }
    >
      {name}
    </NLink>
  );
}
