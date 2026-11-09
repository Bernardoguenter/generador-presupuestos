import { describe, it, expect } from "vitest";
import { getStructureDefaultsByWidth, widthCategory } from "../structureDefaults";
import { getRemecoPDFFileName, getRemecoPDFTitle } from "../remecoPDF";

describe("getStructureDefaultsByWidth", () => {
  it("hasta 12 m: alto 4,5, cerramiento 4, portón 4,5 x 4,5", () => {
    expect(getStructureDefaultsByWidth(12)).toEqual({ height: 4.5, enclousure: 4, gate: { width: 4.5, height: 4.5 } });
    expect(widthCategory(12)).toBe("chico");
  });
  it("más de 12 m: alto 5, cerramiento 4,5, portón 4,5 de ancho x 5 de alto", () => {
    expect(getStructureDefaultsByWidth(12.5)).toEqual({ height: 5, enclousure: 4.5, gate: { width: 4.5, height: 5 } });
    expect(widthCategory(15)).toBe("grande");
  });
});

describe("nombre del PDF", () => {
  it("usa las medidas del galpón", () => {
    const b = { structure_type: "Galpón", width: 10, length: 15, customer: "Gabriel Caceres" };
    expect(getRemecoPDFTitle(b)).toBe("Presupuesto Galpón 10 × 15 m");
    expect(getRemecoPDFFileName(b)).toBe("Presupuesto Galpón 10x15 - Gabriel Caceres.pdf");
    expect(getRemecoPDFFileName({ ...b, customer: "" })).toBe("Presupuesto Galpón 10x15.pdf");
  });
});
