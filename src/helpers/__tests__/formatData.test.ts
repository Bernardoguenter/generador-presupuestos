import { describe, it, expect } from "vitest";
import {
  formatCompanyName,
  formatFileType,
  formatDate,
  formatNumber,
  formatDetails,
  getMimeTypeFromUrl,
  getSilosDescriptions,
  getStructureDefaultDescription,
  isEnclosureUniform,
  getDefaultCaption,
  getTotalArs,
  priceInUSD,
  priceInARS,
} from "../formatData";
import type { Silos } from "@/types";

describe("formatCompanyName", () => {
  it("convierte nombre con espacios en slug", () => {
    expect(formatCompanyName("Empresa de Pruebas")).toBe("empresa-de-pruebas");
  });

  it("mantiene nombres sin espacios igual", () => {
    expect(formatCompanyName("Prueba")).toBe("Prueba");
  });
});

describe("formatFileType", () => {
  it("extrae la extensión del tipo MIME", () => {
    const file = { type: "image/png" } as File;
    expect(formatFileType(file)).toBe("png");
  });
});

describe("formatDate", () => {
  it("formatea fecha correctamente", () => {
    // Usamos una fecha con hora para evitar saltos de día por zona horaria
    expect(formatDate("2023-12-25T12:00:00")).toBe("25/12/2023");
  });
});

describe("formatNumber", () => {
  it("formatea números con separador de miles y decimales", () => {
    // Reemplazamos cualquier tipo de espacio en blanco por un espacio normal
    const result = formatNumber(1234.56).replace(/\s/g, " ");
    // En algunos entornos el separador de miles puede ser un espacio fino
    // pero aquí esperamos el formato es-ES estándar 1.234,56
    expect(result).toMatch(/1[.,\s]?234,56/);
  });
});

describe("getMimeTypeFromUrl", () => {
  it("retorna MIME type correcto según extensión", () => {
    expect(getMimeTypeFromUrl("test.png")).toBe("image/png");
    expect(getMimeTypeFromUrl("test.jpg")).toBe("image/jpg");
    expect(getMimeTypeFromUrl("test.webp")).toBe("image/webp");
  });

  it("retorna image/png por defecto si no conoce la extensión", () => {
    expect(getMimeTypeFromUrl("test.unknown")).toBe("image/png");
  });
});

describe("isEnclosureUniform", () => {
  it("retorna true si todos son iguales", () => {
    expect(isEnclosureUniform([3, 3, 3, 3])).toBe(true);
    expect(isEnclosureUniform([3])).toBe(true);
  });

  it("retorna false si hay diferencias", () => {
    expect(isEnclosureUniform([3, 3, 4, 3])).toBe(false);
  });
});

describe("getDefaultCaption", () => {
  it("incluye flete e IVA", () => {
    const caption = getDefaultCaption(true, true, 10.5, "structure");
    expect(caption).toContain("* El precio incluye el flete");
    expect(caption).toContain("* Incluye IVA 10.5%");
    expect(caption).toContain("* No incluye hormigón");
  });

  it("excluye flete e IVA", () => {
    const caption = getDefaultCaption(false, false, 21, "silo");
    expect(caption).toContain("* El precio no incluye el flete");
    expect(caption).toContain("* No Incluye IVA 21%");
    expect(caption).not.toContain("* No incluye hormigón");
  });
});

describe("getTotalArs", () => {
  it("calcula total ARS con markup", () => {
    // 100 * 1000 * 1.1 = 110000
    expect(getTotalArs(100, 1000, 10)).toBeCloseTo(110000, 2);
  });
});

describe("priceInUSD / priceInARS", () => {
  it("convierte ARS a USD aplicando markups", () => {
    // 1320 / 1000 / 1.1 / 1.2 = 1320 / 1000 / 1.32 = 1
    expect(priceInUSD(1320, 1000, 10, 20)).toBeCloseTo(1, 5);
  });

  it("convierte USD a ARS aplicando markups", () => {
    // 1 * 1000 * 1.1 * 1.2 = 1320
    expect(priceInARS(1, 1000, 10, 20)).toBeCloseTo(1320, 5);
  });
});

describe("getStructureDefaultDescription", () => {
  it("retorna descripción básica para Silos/Otros", () => {
    expect(getStructureDefaultDescription("Tinglado", 10, 20, 5, [3])).toBe("Tinglado de 10mts x 20mts x 5mts de altura libre");
  });

  it("retorna descripción con cerramiento uniforme para Galpón", () => {
    expect(getStructureDefaultDescription("Galpón", 10, 20, 5, [3])).toBe("Galpón de 10mts x 20mts x 5mts de altura libre con 3mts de cerramiento de chapa en los laterales.");
  });

  it("retorna descripción detallada para cerramiento no uniforme", () => {
    const desc = getStructureDefaultDescription("Galpón", 10, 20, 5, [1, 2, 3, 4]);
    expect(desc).toContain("1mts de cerramiento de chapa lateral izquierdo");
    expect(desc).toContain("2mts de cerramiento de chapa lateral derecho");
    expect(desc).toContain("3mts de cerramiento de chapa frontal");
    expect(desc).toContain("4mts de cerramiento de chapa trasero");
  });
});

describe("getSilosDescriptions", () => {
  it("retorna descripciones para silos", () => {
    const silos: Silos = [
      { type: "feeder_silos", capacity: "4tn", has_fiber_base: false },
      { type: "airbase_silos", capacity: "100tn", cone_base: "estandar" }
    ];
    const results = getSilosDescriptions(silos);
    expect(results).toHaveLength(2);
    expect(results[0]).not.toBe("Silo no definido");
    expect(results[1]).not.toBe("Silo no definido");
  });

  it("agrega base de fibra para feeder silos", () => {
    const silos: Silos = [
      { type: "feeder_silos", capacity: "12tn", has_fiber_base: true }
    ];
    const results = getSilosDescriptions(silos);
    expect(results[0]).toContain("base de fibra");
  });
});

describe("formatDetails", () => {
  it("genera detalles básicos", () => {
    const details = formatDetails(
      "Galpón",
      "Hierro torsionado",
      false,
      false,
      false,
      [],
      false,
      0,
      10,
      "Acero Galvanizado n°27",
      "Acero Galvanizado n°27",
      false,
      false
    );
    expect(details).toContain("Chapa de techo: Acero Galvanizado n°27");
    expect(details).toContain("Chapa de lateral: Acero Galvanizado n°27");
  });

  it("incluye extras de color y membrana", () => {
    const details = formatDetails(
      "Galpón",
      "Hierro torsionado",
      true,
      true,
      false,
      [],
      false,
      0,
      10,
      "Acero Galvanizado n°27",
      "Acero Galvanizado n°27",
      true,
      true
    );
    expect(details).toContain("Chapa de techo: Acero Galvanizado n°27 color, con membrana doble cara");
    expect(details).toContain("Chapa de lateral: Acero Galvanizado n°27 color, con membrana doble cara");
  });

  it("incluye portones y canaletas", () => {
    const details = formatDetails(
      "Galpón",
      "Hierro torsionado",
      false,
      false,
      true,
      [{ height: 4, width: 4 }],
      true,
      40,
      10,
      "Acero",
      "Acero",
      false,
      false
    );
    expect(details).toContain("Portón corredizo de 4 x 4mts");
    expect(details).toContain("40mts de canaletas");
  });
});
