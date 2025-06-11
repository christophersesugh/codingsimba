import { Form, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { navLinks } from "~/constants/navlinks";
import { LogOut, Menu, UserPen } from "lucide-react";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "~/lib/shadcn";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useMobileNav } from "~/contexts/mobile-nav";
import { useOptionalUser } from "~/hooks/user";
import { getInitials } from "~/utils/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export function Navbar() {
  const location = useLocation();
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
        // "p hidden": hideNavbar,
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
            <Button className="hidden md:flex" asChild>
              <Link to={"/signin"}>Sign In</Link>
            </Button>
          ) : null}

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:block" asChild>
                <Avatar className="size-9">
                  <AvatarImage src={profile.image!} alt={profile.name!} />
                  <AvatarFallback className="border border-slate-300 dark:border-gray-800">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem className="font-bold" asChild>
                  <Link to={"/profile"} prefetch="intent" className="font-bold">
                    <UserPen className="mr-2 size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <Separator className="my-1" />

                <Form
                  method="post"
                  action="/signout"
                  className="h-full w-full px-2 font-bold text-red-600 dark:text-red-500"
                >
                  <button type="submit" className="flex items-center">
                    <LogOut className="mr-2 size-4 font-bold text-red-600 dark:text-red-500" />
                    Sign Out
                  </button>
                </Form>
              </DropdownMenuContent>
            </DropdownMenu>
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
