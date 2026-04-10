import { describe, it, expect } from "vitest";
import {
  calculateFreightPrice,
  getSheetsFactor,
  getStructureBudgetTotal,
  getSiloBudgetTotal,
  calculateSilosSubtotal,
  calculateEnclousureArea,
  calculatePricePerMeter,
  calculateColumnsCost,
  calculateEnclousureTotalCost,
  calculateRoofExtrasCost,
  applyTaxAndMarkup,
} from "../formulas";
import type { Preferences, Silo, SolidWebPriceMap } from "@/types";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const solidWebPrices: SolidWebPriceMap = {
  8: 500,
  12: 600,
  16: 700,
  20: 800,
  25: 900,
  30: 1000,
};

const basePreferences: Preferences = {
  company_id: "test",
  dollar_quote: 1000,
  default_markup: 0,
  gate_price: 100,
  gutter_price: 50,
  km_price: 10,
  colored_sheet_difference: 200,
  u_profile_cost: 300,
  twisted_iron_cost: 250,
  enclousure_cost: 150,
  iva_percentage: 10.5,
  twisted_iron_column_cost: 80,
  u_profile_column_cost: 90,
  solid_web_price_list: solidWebPrices,
  solid_web_columns_price_list: solidWebPrices,
  feeder_silos: { "100": 5000, "200": 8000 },
  airbase_silos: { "100": 6000, "200": 10000 },
  cone_base_45: 10,
  cone_base_55: 20,
  estimated_delivery_structures: 30,
  estimated_delivery_silos: 45,
  sheets_options: { "Acero Galvanizado n°27": 100, "Acero Color n°27": 300 },
  membrane_cost: 50,
  fiber_base_cost: 200,
};

/** Parámetros base para getStructureBudgetTotal.
 *  width=10, length=20, height=5 → floorArea=200, perimeter=60
 *  material=Hierro torsionado → price_per_meter=250
 *  baseStructureAndRoofCost = 200 * 250 = 50000
 *  height===5 → columnsCost = 0
 *  enclousure_height=[3], uniform → enclousureArea = 60 * 3 = 180
 *  enclousureCost = 180 * 150 = 27000
 *  Sin extras → total = 77000
 */
const baseStructureParams = {
  preferences: basePreferences,
  width: 10,
  length: 20,
  height: 5,
  enclousure_height: [3],
  structure_type: "Galpón",
  material: "Hierro torsionado",
  color_roof_sheet: false,
  color_side_sheet: false,
  gutter_metters: 0,
  gates_measurements: [],
  includes_gate: false,
  includes_taxes: true,
  freight_price: 0,
  has_gutter: false,
  has_roof_membrane: false,
  has_sides_membrane: false,
  sideSheetFactor: 0,
  roofSheetFactor: 0,
};

// ─── calculateFreightPrice ────────────────────────────────────────────────────

describe("calculateFreightPrice", () => {
  it("multiplica distancia por precio por km", () => {
    expect(calculateFreightPrice(100, 10)).toBe(1000);
  });

  it("retorna 0 para distancia 0", () => {
    expect(calculateFreightPrice(0, 10)).toBe(0);
  });

  it("retorna 0 para precio 0", () => {
    expect(calculateFreightPrice(100, 0)).toBe(0);
  });
});

// ─── getSheetsFactor ──────────────────────────────────────────────────────────

describe("getSheetsFactor", () => {
  it("retorna 0 para Cincalum n°25 acanalada", () => {
    expect(getSheetsFactor("Cincalum n°25 acanalada", basePreferences)).toBe(0);
  });

  it("retorna 0 para Cincalum n°25 trapezoidal", () => {
    expect(getSheetsFactor("Cincalum n°25 trapezoidal", basePreferences)).toBe(0);
  });

  it("retorna el factor de sheets_options para otras chapas", () => {
    expect(getSheetsFactor("Acero Galvanizado n°27", basePreferences)).toBe(100);
    expect(getSheetsFactor("Acero Color n°27", basePreferences)).toBe(300);
  });
});

// ─── getStructureBudgetTotal ──────────────────────────────────────────────────

describe("getStructureBudgetTotal", () => {
  it("calcula precio base correctamente (sin extras)", () => {
    const total = getStructureBudgetTotal(baseStructureParams);
    expect(total).toBe(77000);
  });

  it("aplica markup correctamente", () => {
    const prefs = { ...basePreferences, default_markup: 10 };
    const total = getStructureBudgetTotal({ ...baseStructureParams, preferences: prefs });
    // 77000 * 1.10 = 84700
    expect(total).toBe(84700);
  });

  it("descuenta IVA cuando includes_taxes es false", () => {
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      includes_taxes: false,
    });
    // 77000 * (100 - 10.5) / 100 = 77000 * 0.895 = 68915
    expect(total).toBeCloseTo(68915, 0);
  });

  it("Tinglado tiene enclousureCost = 0", () => {
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      structure_type: "Tinglado",
      enclousure_height: [0],
    });
    // Solo base: 200 * 250 = 50000
    expect(total).toBe(50000);
  });

  it("agrega costo de canaletas cuando has_gutter es true", () => {
    // gutterCost = 40 * 50 = 2000
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      has_gutter: true,
      gutter_metters: 40,
    });
    expect(total).toBe(77000 + 2000);
  });

  it("suma precio de flete", () => {
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      freight_price: 5000,
    });
    expect(total).toBe(77000 + 5000);
  });

  it("agrega costo por chapa de techo a color", () => {
    // roofColorCost = 200 (floorArea) * 200 (colored_sheet_difference) = 40000
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      color_roof_sheet: true,
    });
    expect(total).toBe(77000 + 40000);
  });

  it("agrega membrana de techo", () => {
    // roofMembraneCost = 200 * 50 = 10000
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      has_roof_membrane: true,
    });
    expect(total).toBe(77000 + 10000);
  });

  it("agrega membrana lateral", () => {
    // newMembrane_cost = 50, newEnclousure_cost = 150 + 0 + 50 = 200
    // enclousureCost = 180 * 200 = 36000
    // diff vs base: 36000 - 27000 = +9000
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      has_sides_membrane: true,
    });
    expect(total).toBe(77000 + 9000);
  });

  it("columnas extra cuando height > 5", () => {
    // numberOfColumns = floor(20/5)+1 = 5, totalColumns = 10
    // columnsPrice = twisted_iron_column_cost = 80
    // columnsCost = 10 * |6-5| * 80 * 1 = 800
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      height: 6,
    });
    expect(total).toBe(77000 + 800);
  });

  it("portón no incluye costo cuando includes_gate es false", () => {
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      includes_gate: false,
      gates_measurements: [{ width: 4, height: 4 }],
    });
    expect(total).toBe(77000);
  });

  it("portón con medidas menores a 22.5m² no suma costo extra", () => {
    // gates area = 3*3 = 9 < 22.5 → gateCost = 0
    const total = getStructureBudgetTotal({
      ...baseStructureParams,
      includes_gate: true,
      gates_measurements: [{ width: 3, height: 3 }],
    });
    expect(total).toBe(77000);
  });
});

// ─── calculateSilosSubtotal ───────────────────────────────────────────────────

const feederSilo: Silo = { type: "feeder_silos", capacity: "100" };
const airbaseSilo: Silo = { type: "airbase_silos", capacity: "100", cone_base: "estandar" };

describe("calculateSilosSubtotal", () => {
  it("retorna 0 para array vacío", () => {
    expect(calculateSilosSubtotal(basePreferences, [])).toBe(0);
  });

  it("calcula precio base de silos de alimentación", () => {
    expect(calculateSilosSubtotal(basePreferences, [feederSilo])).toBe(5000);
  });

  it("calcula precio de silos de base aérea", () => {
    expect(calculateSilosSubtotal(basePreferences, [airbaseSilo])).toBe(6000);
  });

  it("aplica factor de cono base 45", () => {
    const silo: Silo = { type: "airbase_silos", capacity: "100", cone_base: "45" };
    // 6000 * (1 + 10/100) = 6600
    expect(calculateSilosSubtotal(basePreferences, [silo])).toBeCloseTo(6600, 5);
  });

  it("aplica factor de cono base 55", () => {
    const silo: Silo = { type: "airbase_silos", capacity: "100", cone_base: "55" };
    // 6000 * (1 + 20/100) = 7200
    expect(calculateSilosSubtotal(basePreferences, [silo])).toBeCloseTo(7200, 5);
  });

  it("suma múltiples silos correctamente", () => {
    const silos: Silo[] = [
      { type: "feeder_silos", capacity: "100" },
      { type: "airbase_silos", capacity: "200", cone_base: "estandar" },
    ];
    // 5000 + 10000 = 15000
    expect(calculateSilosSubtotal(basePreferences, silos)).toBe(15000);
  });
});

// ─── getSiloBudgetTotal ───────────────────────────────────────────────────────

describe("getSiloBudgetTotal", () => {
  it("retorna 0 para lista vacía de silos", () => {
    expect(getSiloBudgetTotal(basePreferences, true, 0, [])).toBe(0);
  });

  it("incluye flete en el total", () => {
    // 5000 + 1000 flete = 6000
    expect(getSiloBudgetTotal(basePreferences, true, 1000, [feederSilo])).toBe(6000);
  });

  it("aplica markup cuando default_markup > 0", () => {
    const prefs = { ...basePreferences, default_markup: 20 };
    // 5000 * 1.20 = 6000
    expect(getSiloBudgetTotal(prefs, true, 0, [feederSilo])).toBe(6000);
  });

  it("descuenta IVA cuando includes_taxes es false", () => {
    // 5000 * 0.895 = 4475
    expect(getSiloBudgetTotal(basePreferences, false, 0, [feederSilo])).toBeCloseTo(4475, 0);
  });
});

// ─── Estructure Helpers ───────────────────────────────────────────────────────

describe("calculateEnclousureArea", () => {
  it("calcula área uniforme correctamente", () => {
    // perimeter = 2 * (10 + 20) = 60; height = 3; area = 180
    expect(calculateEnclousureArea(10, 20, [3])).toBe(180);
  });

  it("calcula área no uniforme correctamente", () => {
    // length * (left + right) + width * (front + back)
    // 20 * (2 + 4) + 10 * (3 + 5) = 20 * 6 + 10 * 8 = 120 + 80 = 200
    expect(calculateEnclousureArea(10, 20, [2, 4, 3, 5])).toBe(200);
  });
});

describe("calculatePricePerMeter", () => {
  it("retorna costo para Hierro torsionado", () => {
    expect(calculatePricePerMeter("Hierro torsionado", 10, basePreferences)).toBe(250);
  });

  it("retorna costo para Perfil u Ángulo", () => {
    expect(calculatePricePerMeter("Perfil u Ángulo", 10, basePreferences)).toBe(300);
  });

  it("calcula costo para Alma llena (Solid Web)", () => {
    // width 10 falls into '12' bracket in solidWebPrices which is 600
    expect(calculatePricePerMeter("Alma llena", 10, basePreferences)).toBe(600);
  });
});

describe("calculateColumnsCost", () => {
  it("retorna 0 si height es 5", () => {
    expect(calculateColumnsCost("Hierro torsionado", 10, 20, 5, basePreferences)).toBe(0);
  });

  it("calcula costo extra para height > 5", () => {
    // length=20 -> totalColumns=10
    // columnsPrice = 80 (twisted铁 column)
    // 10 * |6-5| * 80 * 1 = 800
    expect(calculateColumnsCost("Hierro torsionado", 10, 20, 6, basePreferences)).toBe(800);
  });

  it("calcula ahorro para height < 5", () => {
    // 10 * |4-5| * 80 * -1 = -800
    expect(calculateColumnsCost("Hierro torsionado", 10, 20, 4, basePreferences)).toBe(-800);
  });
});

describe("calculateEnclousureTotalCost", () => {
  it("retorna 0 para Tinglado", () => {
    expect(calculateEnclousureTotalCost("Tinglado", 180, 0, false, false, basePreferences)).toBe(0);
  });

  it("calcula costo base de cerramiento", () => {
    // area=180, enclousure_cost=150 -> 180 * 150 = 27000
    expect(calculateEnclousureTotalCost("Galpón", 180, 0, false, false, basePreferences)).toBe(27000);
  });

  it("incluye factores de chapa y membrana", () => {
    // 150 (base) + 10 (factor) + 50 (membrane) = 210
    // 180 * 210 = 37800
    expect(calculateEnclousureTotalCost("Galpón", 180, 10, true, false, basePreferences)).toBe(37800);
  });

  it("incluye extra por color", () => {
    // 27000 (base) + 180 * 200 (color diff) = 27000 + 36000 = 63000
    expect(calculateEnclousureTotalCost("Galpón", 180, 0, false, true, basePreferences)).toBe(63000);
  });
});

describe("calculateRoofExtrasCost", () => {
  it("retorna 0 si no hay extras", () => {
    expect(calculateRoofExtrasCost(200, 0, false, false, basePreferences)).toBe(0);
  });

  it("suma todos los extras correctamente", () => {
    // factor: 200 * 10 = 2000
    // membrane: 200 * 50 = 10000
    // color: 200 * 200 = 40000
    // total = 52000
    expect(calculateRoofExtrasCost(200, 10, true, true, basePreferences)).toBe(52000);
  });
});

describe("applyTaxAndMarkup", () => {
  it("aplica solo taxes si markup es 0", () => {
    expect(applyTaxAndMarkup(1000, true, basePreferences)).toBe(1000);
    // 1000 * 0.895 = 895
    expect(applyTaxAndMarkup(1000, false, basePreferences)).toBeCloseTo(895, 2);
  });

  it("aplica markup", () => {
    const prefs = { ...basePreferences, default_markup: 10 };
    // 1000 * 1.1 = 1100
    expect(applyTaxAndMarkup(1000, true, prefs)).toBe(1100);
  });
});
