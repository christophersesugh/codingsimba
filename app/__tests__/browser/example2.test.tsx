import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";
import { AuthDialogProvider } from "~/contexts/auth-dialog";
import HomeRoute from "~/routes/home/index";

test("renders name", async () => {
  render(
    <MemoryRouter>
      <AuthDialogProvider>
        <HomeRoute />
      </AuthDialogProvider>
    </MemoryRouter>,
  );
  const elements = await screen.findAllByText("Coding Simba");
  expect(elements.length).toBeGreaterThan(0);
  elements.forEach((element) => expect(element).toBeInTheDocument());
});
