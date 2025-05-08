import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { navLinks } from "~/constants/navlinks";
import { Menu } from "lucide-react";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "~/lib/shadcn";
import { Logo } from "./logo";
import { useAuthDialog } from "~/contexts/auth-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useMobileNav } from "~/contexts/mobile-nav";
import { useOptionalUser } from "~/hooks/user";
import { getInitials } from "~/utils/user";

export function Navbar() {
  const location = useLocation();
  const { openDialog } = useAuthDialog();
  const { openMobileNav } = useMobileNav();
  const isHomePage = location.pathname === "/";
  const user = useOptionalUser();
  const profile = user?.profile;

  return (
    <nav
      className={cn("pt-6", {
        "bg-transparent": isHomePage,
        "fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/80 pt-0 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80":
          !isHomePage,
      })}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              type="navbar"
              key={link.name}
              name={link.name}
              path={link.path}
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!user ? (
            <Button className="hidden md:flex" onClick={openDialog}>
              Sign In
            </Button>
          ) : null}

          {profile ? (
            <Link to={"/profile"} prefetch="intent" className="hidden md:block">
              <Avatar className="size-9">
                <AvatarImage src={profile.image!} alt={profile.name!} />
                <AvatarFallback className="border border-slate-300 dark:border-gray-800">
                  {getInitials(profile.name!)}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : null}

          <Button
            asChild
            size={"icon"}
            variant={"ghost"}
            className="block md:hidden"
            onClick={openMobileNav}
          >
            <Menu />
          </Button>
        </div>
      </div>
    </nav>
  );
}
