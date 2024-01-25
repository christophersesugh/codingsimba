import React from "react";
import { Fade } from "react-awesome-reveal";
import { Contact } from "./contact";
import { General } from "./general";
import { Sitemap } from "./_sitemap";
import { Social } from "./social";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <hr />
      <footer id="footer" className="max-w-6xl mx-auto px-6  pb-12 pt-28">
        {/* <Fade cascade> */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-12 justify-center">
          <Social />
          <Contact />
          <General />
          <Sitemap />
        </section>
        <p className="mt-12">All rights reserved &copy; Coding Simba {year}.</p>
        {/* </Fade> */}
      </footer>
    </>
  );
}
