import React from "react";
import { Link } from "@remix-run/react";
import { PageHeader } from "./page-header";
import { HeaderButton } from "../header-button";
import home from "~/assets/home.webp";

export function HomeHeader() {
  return (
    <PageHeader
      title="Helping change the world through quality software."
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
      <div className="flex flex-col">
        <div className="flex gap-6">
          <Link to="/blog">
            <button className="capitalize rounded-md bg-[#1f2028] text-[#fff] dark:bg-[#fff] dark:text-[#1f2028] text-lg p-2 mt-6">
              read the blog
            </button>
          </Link>
        </div>
        <HeaderButton to="/#about" buttonText="Learn more about CS." />
      </div>
    </PageHeader>
  );
}
