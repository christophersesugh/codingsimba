import { page } from "@vitest/browser/context";
import { render } from "vitest-browser-react";
import { FormError } from "./form-errors";
import { describe, expect, test } from "vitest";

describe("FormError", () => {
  test("renders a single error message", async () => {
    render(<FormError errors="This is an error" />);
    await expect.element(page.getByText("This is an error")).toBeVisible();
  });

  test("renders multiple error messages", async () => {
    const errors = ["This is an error", "This is another error"];
    render(<FormError errors={errors} />);
    await expect.element(page.getByText(errors[0])).toBeVisible();
    await expect.element(page.getByText(errors[1])).toBeVisible();
  });

  test("renders a single error message with a custom class name", async () => {
    render(<FormError errors="This is an error" className="text-red-500" />);
    expect(page.getByRole("alert")).toHaveClass("text-red-500");
  });

  test("renders an element with accessible role", async () => {
    render(<FormError errors="This is an error" />);
    expect(page.getByRole("alert")).toBeVisible();
  });
});
