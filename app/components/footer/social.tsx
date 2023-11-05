import React from "react";
import { Link } from "@remix-run/react";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
const handles = [
  {
    icon: <BsGithub />,
    link: "https://github.com/christophersesugh",
    name: "github icon",
  },
  {
    icon: <BsLinkedin />,
    link: "https://www.linkedin.com/christopher-sesugh-265332176/",
    name: "linkedin icon",
  },
  {
    icon: <BsTwitter />,
    link: "https://twitter.com/codingsimba_",
    name: "twitter icon",
  },
];
export function Social() {
  return (
    <div className="flex flex-col items-start">
      <h1 className="font-black text-2xl">
        <span className="text-blue-500">Coding </span>Simba
      </h1>
      <p className="text-slate-400 text-xl my-4">
        Software Engineer and Educator.
      </p>
      <div className="flex gap-6 justify-center items-center mt-4">
        {handles.map((handle, index) => (
          <Link
            to={handle.link}
            key={`${handle.link}-${index}`}
            target="_blank"
          >
            <button className="text-2xl" aria-label={handle.name}>
              {handle.icon}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
