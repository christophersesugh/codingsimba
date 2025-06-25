import { test } from "@playwright/test";

test("User signup flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /sign in/i });
  await page.waitForURL("http://localhost:5173/signin", {
    waitUntil: "networkidle",
  });
});
