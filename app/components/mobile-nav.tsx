import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Logo } from "./logo";
import { useMobileNav } from "~/contexts/mobile-nav";
import {
  navLinks,
  learning,
  slogan,
  learningIcons,
} from "~/constants/navlinks";
import { NavLink } from "./nav-link";
import { Separator } from "./ui/separator";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useOptionalUser } from "~/hooks/user";
import { getImgSrc, getInitials, getSeed } from "~/utils/misc";
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
            {/* Learning Links */}
            <div className="w-full">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Learning
              </h3>
              <div className="flex flex-col gap-2">
                {learning.map((link) => {
                  const IconComponent =
                    learningIcons[link.name as keyof typeof learningIcons];
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={closeMobileNav}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium capitalize text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      {IconComponent && <IconComponent className="size-4" />}
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Other Navigation Links */}
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
                      seed: getSeed(user.name),
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
