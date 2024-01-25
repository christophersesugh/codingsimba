import { Link } from "@remix-run/react";
import { Button } from "../ui/button";

type ListProps = {
  items: { name: string; link: string }[];
};

export function List({ items }: ListProps) {
  return (
    <div className="flex flex-col gap-2 justify-center items-start mt-4">
      {items.map((item: { name: string; link: string }, index: number) => (
        <Button
          variant="link"
          key={`${item.link}-${index}`}
          className="p-0 capitalize"
        >
          <Link to={item.link}>{item.name}</Link>
        </Button>
      ))}
    </div>
  );
}
