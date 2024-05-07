import { Link } from "@remix-run/react";
import { Button } from "../ui/button";

export function List({ items }: { items: { name: string; link: string }[] }) {
  return (
    <div className="flex flex-col gap-2 justify-center items-start mt-4">
      {items.map((item: { name: string; link: string }, index: number) => (
        <Button
          asChild
          variant="link"
          key={`${item.link}-${index}`}
          className="p-0 capitalize"
        >
          <Link
            to={item.link}
            rel="noopener noreferrer"
            target={item.link === "/sitemap.xml" ? "_blank" : "_self"}
          >
            {item.name}
          </Link>
        </Button>
      ))}
    </div>
  );
}
