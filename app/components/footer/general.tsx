import { Title } from "./title";
import { List } from "./list";

export function General() {
  return (
    <div>
      <Title title="General" />
      <List items={items} />
    </div>
  );
}

const items = [
  { name: "My Mission", link: "/mission" },
  { name: "Privacy policy", link: "/privacy-policy" },
  { name: "Terms of use", link: "/terms-of-use" },
];
