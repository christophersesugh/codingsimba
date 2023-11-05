import React from "react";
import clsx from "clsx";
import { BsSun, BsMoon } from "react-icons/bs";
import { navItems } from ".";
import { NavButton } from "./nav-button";
import { Button } from "../button";
import { Theme, useTheme } from "~/context/theme-context";

export function MobileNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [theme, , toggleTheme] = useTheme();

  function handleButtonClick() {
    toggleTheme();
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
            <NavButton
              to={item.link}
              onClick={() => setIsOpen(false)}
              className="capitalize w-full"
              ariaLabel={item.name}
            >
              {item.name}
            </NavButton>
          </li>
        ))}
        <li className="border-t-2 py-8 px-4 flex justify-center">
          {/* toggle theme mode */}
          <Button
            onClick={handleButtonClick}
            className="rounded-3xl border-2 p-2"
            ariaLabel="toggle theme mode"
          >
            {theme === Theme.LIGHT ? (
              <>
                <BsMoon className="text-3xl inline mr-4" /> dark mode
              </>
            ) : (
              <>
                <BsSun className="text-3xl inline mr-4" /> light mode
              </>
            )}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
