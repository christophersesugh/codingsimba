import React from "react";
import clsx from "clsx";
import { navItems } from ".";
import { ThemeButton } from "./theme-button";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function MobileNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleButtonClick() {
    setIsOpen(false);
  }

  return (
    <nav
      className={clsx(
        "w-full absolute bg-[#fff] dark:bg-[#1f2028] border-b-2 z-50",
        isOpen ? "block" : "hidden",
      )}
    >
      <ul className="w-full">
        {navItems.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            aria-label={item.name}
            className="border-t-2 py-8 px-4 w-full"
          >
            <Button variant="link" onClick={handleButtonClick} asChild>
              <Link to={item.link} className="capitalize">
                {item.name}
              </Link>
            </Button>
          </li>
        ))}
        <li className="border-t-2 py-8 px-4 flex justify-center">
          {/* toggle theme mode */}
          <ThemeButton handleButtonClick={handleButtonClick} />
        </li>
      </ul>
    </nav>
  );
}
