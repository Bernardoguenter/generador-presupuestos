import { test, expect } from "@playwright/test";
import { setupCommonMocks } from "./mocks";

test.describe("Presupuestos", () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);

    // Mock de creación de presupuesto
    await page.route("**/rest/v1/budgets_**", async (route) => {
      const method = route.request().method();
      if (method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "new-budget-id", customer: "Cliente Test" }),
        });
      } else if (method === "GET") {
         // Mock de obtención de presupuesto por ID (detalle)
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{
            id: "existing-id",
            customer: "Cliente Existente",
            width: 10,
            length: 20,
            height: 4,
            structure_type: "Galpón",
            material: "Hierro torsionado",
            created_by: "550e8400-e29b-41d4-a716-446655440000",
            enclousure_height: [4, 4, 4, 4],
            includes_freight: false,
            includes_gate: false,
            includes_taxes: true,
            total: 5000,
            budget_markup: 0,
            address: { address: "Calle Test 123", lat: 0, lng: 0 },
            details: "Mocked details",
            paymentMethods: "Mocked payment",
            caption: "Mocked caption",
            estimatedDelivery: "30 días"
          }]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/budgets/calculator");
  });

  test("calculadora de estructuras - flujo completo", async ({ page }) => {
    await page.fill('input[name="customer"]', "Cliente Estructura Test");
    await page.fill('input[name="width"]', "20");
    await page.fill('input[name="length"]', "40");
    await page.fill('input[name="height"]', "6");

    await page.click('button:has-text("Crear Vista Previa")');

    await expect(page.getByText("Confirmación de Presupuesto", { exact: false })).toBeVisible();
    await page.click('button[type="submit"]');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });

  test("calculadora de silos - flujo completo", async ({ page }) => {
    await page.click('button:has-text("Silos")');
    await page.fill('input[name="customer"]', "Cliente Silo Test");
    
    // El primer silo ya existe en el form
    await page.click('button:has-text("Crear Vista Previa")');
    await page.click('button[type="submit"]');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });

  test("edición de presupuesto existente", async ({ page }) => {
    await page.goto("/budgets/structures/existing-id");
    await page.click('button:has-text("Editar Formulario")');
    await page.fill('input[name="customer"]', "Cliente Modificado");
    await page.click('button:has-text("Crear Vista Previa")');
    await page.click('button[type="submit"]');
    await expect(page.locator(".swal2-popup")).toBeVisible();
  });
});
