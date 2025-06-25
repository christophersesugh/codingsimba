import { test, expect } from "@playwright/test";

test("User signup flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /sign in/i }).click();
  await expect(page.getByText(/sign in/i)).toBeVisible();
});
