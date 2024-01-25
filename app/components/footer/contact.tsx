import { Title } from "./title";
import { List } from "./list";

export function Contact() {
  return (
    <div>
      <Title title="Contact" />
      <List items={items} />
    </div>
  );
}

const items = [{ name: "Email Chris", link: "/contact" }];
