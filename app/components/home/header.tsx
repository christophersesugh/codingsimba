import home from "~/assets/home.webp";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { PageHeader } from "./page-header";
import { HeaderButton } from "../header-button";
import { Button } from "../ui/button";
import { textVariants } from "~/animation-config";

export function HomeHeader() {
  return (
    <PageHeader
      title="Crafting exceptional software solutions for tomorrow's challenges."
      headerImage={
        <img
          src={home}
          alt="dsa"
          width={300}
          height={300}
          className="self-start rounded-xl w-full mx-auto md:w-[80%]"
        />
      }
    >
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col"
      >
        <motion.div variants={textVariants} className="flex gap-6">
          <Link to="/blog">
            <Button size="lg" className="capitalize rounded-md text-lg mt-6">
              read the blog
            </Button>
          </Link>
        </motion.div>
        <HeaderButton to="/#about" buttonText="Learn more about CS." />
      </motion.div>
    </PageHeader>
  );
}
