import { test as setup, expect } from "@playwright/test";
import { setupCommonMocks, MOCKED_TOKEN } from "./mocks";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await setupCommonMocks(page);

  // Mocking Supabase Auth Response (Token exchange)
  await page.route("**/auth/v1/token?grant_type=password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: MOCKED_TOKEN,
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mocked-refresh-token",
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          aud: "authenticated",
          role: "authenticated",
          email: "test@example.com",
          user_metadata: { fullName: "Test User", role: "superadmin" },
        },
      }),
    });
  });

  await page.goto("/account/login", { waitUntil: "networkidle" });
  
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');

  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await emailInput.fill("test@example.com");
  await passwordInput.fill("password123");
  await submitButton.click();

  // Wait for redirect to home page
  await expect(page).toHaveURL("/", { timeout: 10000 });

  // Save storage state
  await page.context().storageState({ path: authFile });
});
