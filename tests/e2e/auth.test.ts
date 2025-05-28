import { test } from "@playwright/test";

test("User signup flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /sign in/ }).click();
  await page.waitForURL("http://localhost:5173/signin");
});
