import { NavLink as RouterNavLink } from "react-router";
import { cn } from "~/utils/misc";

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
    <RouterNavLink
      prefetch="intent"
      to={path}
      onClick={onClick}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          "m-0 p-0 text-gray-700 capitalize transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
          { "text-lg": type === "navbar" },
          isActive ? "underline dark:text-white" : "",
        )
      }
    >
      {name}
    </RouterNavLink>
  );
}
