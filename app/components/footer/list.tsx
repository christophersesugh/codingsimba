import React from "react";
import { Link } from "@remix-run/react";

type ListProps = {
  items: { name: string; link: string }[];
};

export function List({ items }: ListProps) {
  return (
    <div className="flex flex-col gap-2 justify-center items-start mt-4">
      {items.map((item: { name: string; link: string }, index: number) => (
        <Link to={item.link} key={`${item.link}-${index}`}>
          <button className="capitalize hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 text-md transition-all duration-300">
            {item.name}
          </button>
        </Link>
      ))}
    </div>
  );
}
