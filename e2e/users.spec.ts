import { test, expect } from "@playwright/test";
import { setupCommonMocks } from "./mocks";

test.describe("Gestión de Usuarios", () => {
  const mockUser = {
    id: "mocked-user-xyz",
    fullName: "Usuario de Prueba",
    email: "test-user@empresa.com",
    role: "usuario",
    company_id: "mocked-company-id",
    isPasswordChanged: true,
  };

  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);

    // Sobrescribir mock de usuarios para añadir lógica de listado específica del test
    await page.route("**/rest/v1/users**", async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        const url = route.request().url();
        if (url.includes("id=eq.")) {
           await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(mockUser),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([mockUser]),
          });
        }
      } else if (method === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockUser),
        });
      } else {
        await route.continue();
      }
    });

    // Mock roles
    await page.route("**/rest/v1/roles**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "superadmin", label: "Super Admin" },
          { id: "usuario", label: "Usuario" }
        ]),
      });
    });

    // Mock Edge Function: create-user
    await page.route("**/functions/v1/create-user", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: mockUser, error: null }),
      });
    });

    await page.goto("/users");
  });

  test("debe listar usuarios", async ({ page }) => {
    await expect(page.getByText("Usuario de Prueba")).toBeVisible();
  });

  test("crear nuevo usuario - flujo completo", async ({ page }) => {
    await page.click('a:has-text("Crear usuario"), button:has-text("Crear usuario")');
    await expect(page).toHaveURL(/.*create-user/);

    await page.fill('input[name="fullName"]', "Nuevo Nombre");
    await page.fill('input[name="email"]', "nuevo@usuario.com");
    await page.selectOption('select[name="role"]', "usuario");
    await page.selectOption('select[name="company_id"]', "mocked-company-id");

    await page.click('button[type="submit"]');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });

  test("editar usuario existente", async ({ page }) => {
    await page.click('text=Usuario de Prueba');
    await expect(page).toHaveURL(new RegExp(`.*users/${mockUser.id}`));

    await page.fill('input[name="fullName"]', "Nombre Editado");
    await page.click('button:has-text("Editar usuario")');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });
});
