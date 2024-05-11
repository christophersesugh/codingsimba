import cas from "~/assets/cas.png";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { HeaderButton } from "../header-button";
import { imageLoadAnimationProps, textVariants } from "~/animation-config";

export function About() {
  return (
    <motion.section
      id="about"
      className="px-6 flex flex-col justify-center items-center gap-12 md:flex-row max-w-5xl mx-auto mt-32 md:my-20 mb-12 pt-12"
    >
      <motion.img
        {...imageLoadAnimationProps}
        src={cas}
        width={200}
        height={250}
        alt="Christopher Aondona Sesugh [Coding Simba]"
        className="md:self-start rounded-full md:mx-14 h-[250px] w-[200px]"
      />
      <motion.div variants={textVariants} className="max-w-xl">
        <motion.h2 variants={textVariants} className="text-3xl">
          Hi, I am Christopher Aondona Sesugh [Coding Simba]. I am a software
          engineer and a teacher. I love building quality software and sharing
          my existing knowledge across the globe.
        </motion.h2>
        <motion.h3
          variants={textVariants}
          className="text-2xl text-slate-400 mt-8"
        >
          I am also an athlete and love exercising in the gym or working out at
          home.
        </motion.h3>
        <HeaderButton
          to="/about"
          icon={<BsArrowRight className="text-lg animate-pulse" />}
          buttonText="Learn more about Me."
        />
      </motion.div>
    </motion.section>
  );
}
