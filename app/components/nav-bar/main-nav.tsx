import React from "react";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { navItems } from ".";
import { Link } from "@remix-run/react";
import { ThemeButton } from "./theme-button";
import { Button } from "../ui/button";
import { charVariants, logoTextVariants } from "~/animation-config";

export function MainNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const logoText = "Coding Simba";
  return (
    <nav className="max-w-7xl mx-auto transition ease-in duration-300 flex justify-between px-8 py-12 items-center">
      <Link to="/">
        <motion.div
          variants={logoTextVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold hover:underline underline-offset-8 mr-4 md:mr-0"
        >
          {logoText.split("").map((char, index) => (
            <motion.span key={index} variants={charVariants}>
              {index > 6 ? <span className="text-blue-600">{char}</span> : char}
            </motion.span>
          ))}
        </motion.div>
      </Link>
      <ul className="hidden md:flex justify-between gap-6 items-center">
        {navItems.map((item) => (
          <li key={item.name} aria-label={item.name}>
            <Button variant="link" className="text-lg capitalize" asChild>
              <Link to={item.link}>{item.name}</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className=" md:hidden !rounded-md border-2 p-2 transition-all duration-300
        "
        >
          {isOpen ? (
            <FaTimes className="text-3xl text-red-500" />
          ) : (
            <FaBars className="text-3xl" />
          )}
        </Button>

        {/* toggle theme mode */}
        <div className="hidden md:block">
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
}
