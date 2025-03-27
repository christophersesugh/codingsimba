import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import HomeRoute from "~/routes/home/index";

test("renders name", async () => {
  const { getByText } = render(<HomeRoute title="Hello Vitest!" />);
  await expect.element(getByText("Hello Vitest!")).toBeInTheDocument();
});
