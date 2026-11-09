import { describe, it, expect } from "vitest";
import { companyHasRenders, getGeneradorParams } from "../structureRenders";

const base = {
  structure_type: "Galpón",
  material: "Perfil u Ángulo",
  width: 15,
  length: 20,
  height: 5,
  enclousure_height: [4.5, 4.5, 4.5, 4.5],
  color_side_sheet: false,
  includes_gate: true,
  number_of_gates: 1,
  gates_measurements: [{ width: 4, height: 4.5 }],
};

describe("getGeneradorParams", () => {
  it("pasa medidas, sistema, portón y desde dónde arranca la chapa", () => {
    const p = getGeneradorParams(base);
    expect(p.get("ancho")).toBe("15");
    expect(p.get("largo")).toBe("20");
    expect(p.get("alto")).toBe("5");
    expect(p.get("sistema")).toBe("perfil");
    expect(p.get("porton")).toBe("4x4.5");
    expect(p.get("cerr")).toBe("0.5");
    expect(p.get("color")).toBe("cincalum");
  });

  it("chapa hasta el piso cuando el cerramiento cubre toda la altura", () => {
    const p = getGeneradorParams({ ...base, enclousure_height: [5] });
    expect(p.get("cerr")).toBe("0");
  });

  it("tinglado: sin chapa lateral ni portón", () => {
    const p = getGeneradorParams({ ...base, structure_type: "Tinglado" });
    expect(p.get("cerr")).toBe("5");
    expect(p.get("porton")).toBe("0");
  });

  it("sin portón y con chapa color", () => {
    const p = getGeneradorParams({
      ...base,
      includes_gate: false,
      color_side_sheet: true,
      material: "Hierro torsionado",
    });
    expect(p.get("porton")).toBe("0");
    expect(p.get("color")).toBe("gris");
    expect(p.get("sistema")).toBe("torsionado");
  });
});

describe("getGeneradorParams aguas", () => {
  it("dos aguas por defecto y un agua si se pide", () => {
    expect(getGeneradorParams(base).get("aguas")).toBe("2");
    expect(getGeneradorParams(base, 1).get("aguas")).toBe("1");
  });
});

describe("companyHasRenders", () => {
  it("solo para Remeco", () => {
    expect(companyHasRenders("Metalúrgica Remeco")).toBe(true);
    expect(companyHasRenders("Indugal")).toBe(false);
    expect(companyHasRenders(undefined)).toBe(false);
  });
});
