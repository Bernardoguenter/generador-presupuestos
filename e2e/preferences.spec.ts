import { test, expect } from "@playwright/test";
import { setupCommonMocks } from "./mocks";

test.describe("Preferencias Globales", () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);

    // Mock Edge Function: set-preferences
    await page.route("**/functions/v1/set-preferences", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/preferences");
  });

  test("debe cargar y permitir actualizar preferencias", async ({ page }) => {
    await expect(page.getByText("Preferencias", { exact: false })).toBeVisible();

    const dollarInput = page.locator('input[name="dollar_quote"]');
    await dollarInput.clear();
    await dollarInput.fill("1100");

    const markupInput = page.locator('input[name="default_markup"]');
    await markupInput.clear();
    await markupInput.fill("20");

    await page.click('button:has-text("Actualizar preferencias")');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });
});
