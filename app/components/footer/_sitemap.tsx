import { Title } from "./title";
import { List } from "./list";

export function Sitemap() {
  return (
    <div>
      <Title title="Sitemap" />
      <List items={items} />
    </div>
  );
}

const items = [
  { name: "home", link: "/" },
  { name: "blog", link: "/blog" },
  { name: "discord", link: "/discord" },
  { name: "about", link: "/about" },
  { name: "contact", link: "/contact" },
];
