import type { Page } from "@playwright/test";

export const MOCKED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vaXlkZnZubHp3b2VrdnZ5YWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDYxMjMsImV4cCI6MjA2MjAyMjEyM30.TCJu6aHMODc9ELlInMi4jcZJoiEEv--oN-CapAc6BFw";
export const MOCKED_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function setupCommonMocks(page: Page) {
  // Mock de sesión de usuario (para AuthProvider)
  await page.route("**/auth/v1/user**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: MOCKED_USER_ID,
        aud: "authenticated",
        role: "authenticated",
        email: "test@example.com",
        user_metadata: { fullName: "Test User", role: "superadmin" },
      }),
    });
  });

  // Mock de obtención de perfil de usuario
  await page.route("**/rest/v1/users**", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      // Devolver el usuario logueado o una lista dependiendo de la llamada
      const url = route.request().url();
      if (url.includes(`id=eq.${MOCKED_USER_ID}`)) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: MOCKED_USER_ID,
            fullName: "Test User",
            email: "test@example.com",
            role: "superadmin",
            company_id: "mocked-company-id",
            isPasswordChanged: true,
          }),
        });
      } else {
        // Por defecto una lista (para las tablas)
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: MOCKED_USER_ID,
              fullName: "Test User",
              email: "test@example.com",
              role: "superadmin",
              company_id: "mocked-company-id",
              isPasswordChanged: true,
            },
          ]),
        });
      }
    } else {
      await route.continue();
    }
  });

  // Mock de preferencias
  await page.route("**/rest/v1/company_settings**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        company_id: "mocked-company-id",
        dollar_quote: 1000,
        default_markup: 15,
        km_price: 500,
        iva_percentage: 21,
        colored_sheet_difference: 200,
        u_profile_cost: 1500,
        twisted_iron_cost: 1200,
        enclousure_cost: 800,
        gutter_price: 300,
        gate_price: 2500,
        twisted_iron_column_cost: 1000,
        u_profile_column_cost: 1100,
        solid_web_price_list: {
          "8": 100,
          "12": 150,
          "16": 200,
          "20": 250,
          "25": 300,
          "30": 350,
        },
        solid_web_columns_price_list: {
          "8": 80,
          "12": 120,
          "16": 160,
          "20": 200,
          "25": 240,
          "30": 280,
        },
        feeder_silos: { "Silo 1": 10000 },
        airbase_silos: { "Silo A": 20000 },
        cone_base_45: 5,
        cone_base_55: 10,
        estimated_delivery_structures: 30,
        estimated_delivery_silos: 45,
        sheets_options: { "Cincalum n°25 acanalada": 10 },
        membrane_cost: 50,
        fiber_base_cost: 200,
      }),
    });
  });

  // Mock de empresas
  await page.route("**/rest/v1/companies**", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "mocked-company-id",
            company_name: "Empresa Test",
            address: { address: "Calle Falsa 123", lat: 0, lng: 0 },
          },
        ]),
      });
    } else {
      await route.continue();
    }
  });

  // Logs opcionales para debug
  page.on("console", (msg) => {
    if (msg.type() === "error")
      console.log(`BROWSER ERROR [${page.url()}]: ${msg.text()}`);
  });
}
