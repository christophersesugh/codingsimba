import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Logo } from "./logo";
import { useMobileNav } from "~/contexts/mobile-nav";
import { navLinks } from "~/constants/navlinks";
import { NavLink } from "./nav-link";
import { Separator } from "./ui/separator";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useOptionalUser } from "~/hooks/user";
import { getInitials } from "~/utils/user";

export function MobileNav() {
  const { open, closeMobileNav } = useMobileNav();

  const user = useOptionalUser();
  const profile = user?.profile;
  return (
    <aside>
      <Sheet open={open} onOpenChange={closeMobileNav}>
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
                onClick={closeMobileNav}
              />
            ))}
          </nav>
          <Separator />
          <div className="flex justify-center gap-4 px-4 pb-4">
            <ThemeToggle />
            {!user ? (
              <Button className="flex" asChild>
                <Link to={"/signin"}>Sign In</Link>
              </Button>
            ) : null}

            {profile ? (
              <Link to={"/profile"} prefetch="intent" onClick={closeMobileNav}>
                <Avatar className="size-9">
                  <AvatarImage src={profile.image!} alt={profile.name!} />
                  <AvatarFallback>{getInitials(profile.image!)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  );
}
