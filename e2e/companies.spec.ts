import { test, expect } from "@playwright/test";
import { setupCommonMocks } from "./mocks";

test.describe("Gestión de Empresas", () => {
  const mockCompany = {
    id: "mocked-company-id",
    company_name: "Empresa Test",
    email: "test@empresa.com",
    phone: "12345678",
    address: { address: "Calle Principal 10", lat: -34.6, lng: -58.4 },
    hasPdfAddress: false,
    logo_url: "http://example.com/logo.png",
  };

  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);

    // Sobrescribir mock de empresas para añadir POST/PATCH
    await page.route("**/rest/v1/companies**", async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([mockCompany]),
        });
      } else if (method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockCompany),
        });
      } else if (method === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockCompany),
        });
      } else {
        await route.continue();
      }
    });

    // Mock storage upload
    await page.route("**/storage/v1/object/company_logos/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ path: "test-logo.png" }),
      });
    });

    await page.goto("/companies");
  });

  test("debe listar empresas", async ({ page }) => {
    await expect(page.getByText("Empresa Test")).toBeVisible();
  });

  test("crear nueva empresa - flujo completo", async ({ page }) => {
    await page.click('a:has-text("Crear empresa"), button:has-text("Crear empresa")');
    await expect(page).toHaveURL(/.*create-company/);

    await page.fill('input[name="company_name"]', "Nueva Empresa S.A.");
    await page.fill('input[name="email"]', "nueva@empresa.com");
    await page.fill('input[name="phone"]', "987654321");
    await page.fill('input[placeholder*="Dirección"], input[name="address"]', "Calle Nueva 456");

    await page.click('button[type="submit"]');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });

  test("editar empresa existente", async ({ page }) => {
    await page.click('text=Empresa Test');
    await expect(page).toHaveURL(new RegExp(`.*companies/${mockCompany.id}`));

    await page.fill('input[name="company_name"]', "Nombre Editado");
    await page.click('button:has-text("Editar Empresa")');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });
});
