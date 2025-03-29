import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Logo } from "./logo";
import { useSidebar } from "~/contexts/sidebar";
import { navLinks } from "~/constants/navlinks";
import { NavLink } from "./nav-link";
import { Separator } from "./ui/separator";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuthDialog } from "~/contexts/auth-dialog";

export function Sidebar() {
  const { openDialog } = useAuthDialog();
  const { open, closeSidebar } = useSidebar();

  const user = false;
  return (
    <aside>
      <Sheet open={open} onOpenChange={closeSidebar}>
        <SheetContent side="top" className="border-slate-500">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription>
              Helping developers build better software
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <nav className="flex flex-col items-start px-4">
            {navLinks.map((link) => (
              <NavLink
                type="navbar"
                key={link.name}
                name={link.name}
                path={link.path}
                onClick={closeSidebar}
              />
            ))}
          </nav>
          <Separator />
          <div className="flex justify-center gap-4 px-4 pb-4">
            <ThemeToggle />
            {!user ? (
              <Button className="flex" onClick={openDialog}>
                Sign In
              </Button>
            ) : null}

            {user ? (
              <Link to={"/profile"} prefetch="intent" onClick={closeSidebar}>
                <Avatar className="size-9">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CS</AvatarFallback>
                </Avatar>
              </Link>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  );
}
