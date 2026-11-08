import { describe, it, expect } from "vitest";
import { detailsToRows, getStructureTotalArs } from "../remecoPDF";
import { materialsMap } from "../staticData";

describe("detailsToRows", () => {
  it("separa el detalle de materiales en filas", () => {
    const rows = detailsToRows(
      materialsMap["Galpón"]["Hierro torsionado"]
        .replace("Chapa de techo:", "Chapa de techo: Cincalum")
        .replace("Chapa de lateral:", "Chapa de lateral: Cincalum") +
        "Portón corredizo de 4.5 x 5mts;20mts de canaletas;",
    );
    expect(rows[0][0]).toBe("Estructura");
    expect(rows[0][1]).toContain("hierro torsionado n.º 16");
    expect(rows).toContainEqual(["Chapa de techo", "Cincalum"]);
    expect(rows).toContainEqual(["Chapa de lateral", "Cincalum"]);
    expect(rows).toContainEqual(["Portón", "Portón corredizo de 4.5 x 5mts"]);
    expect(rows).toContainEqual(["Canaletas", "20mts de canaletas"]);
  });

  it("alma llena: junta los materiales en una fila", () => {
    const rows = detailsToRows(materialsMap["Galpón"]["Alma llena"]);
    const mat = rows.find(([l]) => l === "Materiales");
    expect(mat?.[1]).toContain("alma 151mm");
    expect(mat?.[1]).toContain("ala 100mm");
  });
});

describe("getStructureTotalArs", () => {
  it("usa el mismo redondeo que la tabla del presupuesto", () => {
    expect(getStructureTotalArs({ total: 1000, budget_markup: 10 }, 1535)).toBe(1688000);
  });
});
