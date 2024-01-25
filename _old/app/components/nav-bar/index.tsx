import React from "react";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <MainNav isOpen={isOpen} setIsOpen={setIsOpen} />
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export const navItems = [
  {
    name: "home",
    link: "/",
  },
  {
    name: "blog",
    link: "/blog",
  },
  {
    name: "discord",
    link: "/discord",
  },
  {
    name: "about",
    link: "/about",
  },
  {
    name: "contact CS",
    link: "/contact",
  },
];
