import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Logo } from "./logo";
import { useMobileNav } from "~/contexts/mobile-nav";
import { navLinks, slogan } from "~/constants/navlinks";
import { NavLink } from "./nav-link";
import { Separator } from "./ui/separator";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useOptionalUser } from "~/hooks/user";
import { getImgSrc, getInitials } from "~/utils/misc";
import { SignoutButton } from "./signout-button";

export function MobileNav() {
  const { open, closeMobileNav } = useMobileNav();
  const user = useOptionalUser();

  return (
    <aside>
      <Sheet open={open} onOpenChange={closeMobileNav}>
        <SheetContent side="top" className="border-slate-500">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription>{slogan}</SheetDescription>
          </SheetHeader>
          <Separator className="-mt-4" />
          <nav className="flex flex-col items-start gap-3 px-4">
            {navLinks.map((link, i) => (
              <NavLink
                type="navbar"
                key={`${link.name}-${link.path}-${i}`}
                name={link.name}
                path={link.path}
                onClick={closeMobileNav}
              />
            ))}
            {user ? (
              <div className="-ml-2 mt-1">
                <SignoutButton onClick={closeMobileNav} />
              </div>
            ) : null}
          </nav>
          <Separator />
          <div className="flex justify-center gap-4 px-4 pb-4">
            <ThemeToggle />
            {!user ? (
              <Button onClick={closeMobileNav} className="flex" asChild>
                <Link to={"/signin"}>Sign In</Link>
              </Button>
            ) : null}

            {user ? (
              <Link to={"/profile"} onClick={closeMobileNav}>
                <Avatar className="size-9 border border-gray-300 dark:border-gray-600">
                  <AvatarImage
                    src={getImgSrc({
                      path: "users",
                      fileKey: user.image?.fileKey,
                      seed: user.id,
                    })}
                    alt={user.name}
                  />
                  <AvatarFallback className="border border-slate-300 dark:border-gray-800">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  );
}
