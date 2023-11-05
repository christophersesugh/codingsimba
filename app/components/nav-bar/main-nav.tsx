import React from "react";
import { Fade } from "react-awesome-reveal";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaBars, FaTimes } from "react-icons/fa";
import { navItems } from ".";
import { NavButton } from "./nav-button";
import { Link } from "@remix-run/react";
import { Theme, useTheme } from "~/context/theme-context";
import { Button } from "../button";

export function MainNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [theme, , toggleTheme] = useTheme();

  return (
    <nav className="max-w-8xl mx-auto transition ease-in duration-300 flex justify-between px-8 py-12 items-center">
      <Link to="/">
        <span className="text-3xl font-bold hover:underline underline-offset-8 mr-4 md:mr-0">
          <span className="text-blue-500">Coding </span>
          <Fade cascade duration={200}>
            Simba
          </Fade>
        </span>
      </Link>
      <ul className="hidden md:flex justify-between gap-6 items-center">
        {navItems.map((item) => (
          <li key={item.name} aria-label={item.name}>
            <NavButton
              to={item.link}
              className={`capitalize hover:underline underline-offset-8 transition-all duration-300 hover:ease-linear dark:text-slate-300`}
              ariaLabel={item.name}
            >
              {item.name}
            </NavButton>
          </li>
        ))}
      </ul>
      <div className="flex gap-6">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className=" md:hidden !rounded-full border-2 p-2 hover:border-black dark:hover:border-slate-500 transition-all duration-300
        "
        >
          {isOpen ? (
            <FaTimes className="text-3xl" />
          ) : (
            <FaBars className="text-3xl" />
          )}
        </Button>

        <Button
          onClick={toggleTheme}
          className="hidden md:block !rounded-full border-2 p-2 hover:border-black dark:hover:border-slate-500
        "
        >
          {theme === Theme.LIGHT ? (
            <BsMoon className="text-3xl" />
          ) : (
            <BsSun className="text-3xl" />
          )}
        </Button>
      </div>
    </nav>
  );
}
