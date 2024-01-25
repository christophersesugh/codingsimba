import { BsArrowRight } from "react-icons/bs";
import avatar from "~/assets/avatar.jpeg";
import { HeaderButton } from "../header-button";

export function About() {
  return (
    <section
      id="about"
      className="px-6 flex flex-col justify-center items-center gap-12 md:flex-row max-w-5xl mx-auto mt-32 md:my-20 mb-12 pt-12"
    >
      <img
        src={avatar}
        width={200}
        height={200}
        alt="Coding Simba"
        className="md:self-start rounded-full md:mx-14 h-[200px] w-[200px]"
      />
      <div className="max-w-xl">
        <h2 className="text-3xl">
          Hi, I am Christopher Aondona Sesugh [Coding Simba]. I am a software
          engineer and a teacher. I love building quality software and sharing
          my existing knowledge across the globe.
        </h2>
        <h3 className="text-2xl text-slate-400 mt-8">
          I am also an athlete and love exercising in the gym or working out at
          home.
        </h3>
        <HeaderButton
          to="/about"
          icon={<BsArrowRight className="text-lg animate-pulse" />}
          buttonText="Learn more about Me."
        />
      </div>
    </section>
  );
}
