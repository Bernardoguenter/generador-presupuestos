import {
  coneAdjustments,
  materialsMap,
  silosMap,
  VALID_FIBER_BASE_CAPACITIES,
} from "./staticData";
import type { GatesMeasurements, Silos } from "@/types";

/**
 * Formats a company name into a URL-friendly slug.
 *
 * @param {string} name - The original company name.
 * @returns {string} The formatted name, lowercased and spaces replaced with hyphens.
 */
export const formatCompanyName = (name: string) => {
  return name.includes(" ")
    ? name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .split(" ")
        .join("-")
    : name;
};

/**
 * Extracts the file type (extension) from a File object.
 *
 * @param {File} file - The file whose type is to be extracted.
 * @returns {string | undefined} The file extension without the leading dot.
 */
export const formatFileType = (file: File) => {
  return file.type.split("/").pop();
};

/**
 * Formats a date string into DD/MM/YYYY format.
 *
 * @param {string} date - The date string parsable by Date constructor.
 * @returns {string} Formatted date.
 */
export const formatDate = (date: string) => {
  const newDate = new Date(date);

  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formats a number according to Spanish locale with up to two decimal places.
 *
 * @param {number} num - The number to format.
 * @returns {string} Formatted number string.
 */
export const formatNumber = (num: number) => {
  const valorFormateado = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
  }).format(num);
  return valorFormateado;
};

/**
 * Adjusts Alma llena details based on width.
 *
 * @param {number} width - Width of the structure.
 * @param {string} details - Original detail string.
 * @returns {string} Modified details.
 */
const getAlmaLLena = (width: number, details: string) => {
  if (width > 8 && width <= 12) {
    return details
      .replace("perfil W 200 x 15.0", "perfil W 250 x 22.3")
      .replace(
        "alma 151mm, espesor 4.3mm; ala 100mm espesor 5.2mm",
        "alma 211mm, espesor 5.6mm; ala 102mm espesor 6.1mm",
      );
  }
  if (width > 12 && width <= 16) {
    return details
      .replace("perfil W 200 x 15.0", "perfil W 310 x 28.3")
      .replace(
        "alma 151mm, espesor 4.3mm; ala 100mm espesor 5.2mm",
        "alma 305mm, espesor 6.8mm; ala 165mm espesor 7.1mm",
      );
  }
  if (width > 16 && width <= 20) {
    return details
      .replace("perfil W 200 x 15.0", "perfil W 410 x 38.8")
      .replace(
        "alma 151mm, espesor 4.3mm; ala 100mm espesor 5.2mm",
        "alma 399mm, espesor 6.4mm; ala 140mm espesor 8.8mm",
      );
  }
  if (width > 20 && width <= 25) {
    return details
      .replace("perfil W 200 x 15.0", "perfil W 460 x 52.0")
      .replace(
        "alma 151mm, espesor 4.3mm; ala 100mm espesor 5.2mm",
        "alma 399mm, espesor 8.8mm; ala 152mm espesor 10.8mm",
      )
      .replace(
        "Perfilería (techo): Perfil galvanizado de 100x50x2mm; Perfilería (laterales): Perfil galvanizado 100x50x2mm",
        "Perfilería (techo): Perfil galvanizado de 120x50x2mm; Perfilería (laterales): Perfil galvanizado 120x50x2mm",
      );
  }
  if (width > 25) {
    return details
      .replace("perfil W 200 x 15.0", "perfil W 530 x 66.0")
      .replace(
        "alma 151mm, espesor 4.3mm; ala 100mm espesor 5.2mm",
        "alma 522mm, espesor 9mm; ala 204mm espesor 13.6mm",
      )
      .replace(
        "Perfilería (techo): Perfil galvanizado de 100x50x2mm; Perfilería (laterales): Perfil galvanizado 100x50x2mm",
        "Perfilería (techo): Perfil galvanizado de 120x50x2mm; Perfilería (laterales): Perfil galvanizado 120x50x2mm",
      );
  }
  return details;
};

/**
 * Adjusts Hierro torsionado details based on width.
 *
 * @param {number} width - Width of the structure.
 * @param {string} details - Original detail string.
 * @returns {string} Modified details.
 */
const getHierroTorsionado = (width: number, details: string) => {
  if (width > 16 && width <= 25) {
    return details
      .replace("hierro torsionado n.º 16", "hierro torsionado n.º 20")
      .replace(
        "hierro torsionado n.º 10 y n.º 8",
        "hierro torsionado n.º 12 y n.º 10",
      );
  }
  if (width > 25 && width <= 30) {
    return details
      .replace("hierro torsionado n.º 16", "hierro torsionado n.º 25")
      .replace(
        "hierro torsionado n.º 10 y n.º 8",
        "hierro torsionado n.º 12 y n.º 10",
      );
  }
  return details;
};

/**
 * Adjusts Perfil U Ángulo details based on width.
 *
 * @param {number} width - Width of the structure.
 * @param {string} details - Original detail string.
 * @returns {string} Modified details.
 */
const getPerfilUAngulo = (width: number, details: string) => {
  if (width <= 8) {
    return details
      .replace("perfil U 180 mm x 80 mm", "perfil U 120 mm x 50 mm")
      .replace("ángulo de 1 1/4”", "ángulo de 1 1/8”");
  }
  if (width > 8 && width <= 12) {
    return details
      .replace("perfil U 180 mm x 80 mm", "perfil U 160 mm x 60 mm")
      .replace("ángulo de 1 1/4”", "ángulo de 1 1/8”");
  }
  if (width > 12 && width <= 16) {
    return details
      .replace("perfil U 180 mm x 80 mm", "perfil U 180 mm x 70 mm")
      .replace("ángulo de 1 1/4”", "ángulo de 1 1/4”x1/8”");
  }
  if (width > 16 && width <= 20) {
    return details
      .replace("perfil U 180 mm x 80 mm", "perfil U 200 mm x 80 mm")
      .replace("ángulo de 1 1/4”", "ángulo de 1 1/2”x1/8”");
  }
  if (width > 20 && width <= 25) {
    return details
      .replace("perfil U 180 mm x 80 mm", "perfil U 220 mm x 80 mm")
      .replace("ángulo de 1 1/4”", "ángulo de 1 1/2”x1/8”");
  }
  if (width > 25 && width <= 30) {
    return details
      .replace("perfil U 180 mm x 80 mm", "perfil U 240 mm x 80 mm")
      .replace("ángulo de 1 1/4”", "ángulo de 1 1/2”x1/8”");
  }
  return details;
};

/**
 * Generates a detailed description string for a structure based on its parameters.
 *
 * @param {string} structure_type - Type of the structure (e.g., 'Galpón').
 * @param {string} material - Material used.
 * @param {boolean} color_roof_sheet - Whether roof sheet is colored.
 * @param {boolean} color_side_sheet - Whether side sheet is colored.
 * @param {boolean} includes_gate - Whether a gate is included.
 * @param {GatesMeasurements[]} gates_measurements - Measurements of gates.
 * @param {boolean} has_gutter - Whether gutters are present.
 * @param {number} gutter_metters - Length of gutters.
 * @param {number} width - Width of the structure.
 * @param {string} sides_sheets_option - Side sheet option.
 * @param {string} roof_sheets_option - Roof sheet option.
 * @param {boolean} has_roof_membrane - Roof membrane flag.
 * @param {boolean} has_sides_membrane - Side membrane flag.
 * @returns {string} Formatted detail description.
 */
export const formatDetails = (
  structure_type: string,
  material: string,
  color_roof_sheet: boolean,
  color_side_sheet: boolean,
  includes_gate: boolean,
  gates_measurements: GatesMeasurements[],
  has_gutter: boolean,
  gutter_metters: number,
  width: number,
  sides_sheets_option: string,
  roof_sheets_option: string,
  has_roof_membrane: boolean,
  has_sides_membrane: boolean,
) => {
  let details =
    materialsMap[structure_type as keyof typeof materialsMap]?.[
      material as keyof (typeof materialsMap)[keyof typeof materialsMap]
    ] || "";

  if (material === "Hierro torsionado") {
    details = getHierroTorsionado(width, details);
  } else if (material === "Perfil u Ángulo") {
    details = getPerfilUAngulo(width, details);
  } else if (material === "Alma llena") {
    details = getAlmaLLena(width, details);
  }

  details = details.replace(
    "Chapa de techo:",
    `Chapa de techo: ${roof_sheets_option}${color_roof_sheet ? " color" : ""}${
      has_roof_membrane ? ", con membrana doble cara de aluminio 10 mm" : ""
    }`,
  );

  if (color_roof_sheet && roof_sheets_option.includes("Cincalum")) {
    details = details.replace("Chapa de techo: Cincalum", "Chapa de techo: ");
  }

  if (roof_sheets_option.includes("Exterior chapa")) {
    if (color_roof_sheet) {
      details = details.replace(
        "Chapa de techo: Exterior chapa",
        "Chapa de techo: Exterior chapa color",
      );
    } else {
      details = details.replace(
        "Chapa de techo: Exterior chapa",
        "Chapa de techo: Exterior chapa Cincalum",
      );
    }
  }

  details = details.replace(
    "Chapa de lateral:",
    `Chapa de lateral: ${sides_sheets_option}${
      color_side_sheet && structure_type === "Galpón" ? " color" : ""
    }${has_sides_membrane ? ", con membrana doble cara de aluminio 10 mm" : ""}`,
  );

  if (color_side_sheet && sides_sheets_option.includes("Cincalum")) {
    details = details.replace(
      "Chapa de lateral: Cincalum",
      "Chapa de lateral: ",
    );
  }

  if (sides_sheets_option.includes("Exterior chapa")) {
    if (color_side_sheet) {
      details = details.replace(
        "Chapa de lateral: Exterior chapa",
        "Chapa de lateral: Exterior chapa color",
      );
    } else {
      details = details.replace(
        "Chapa de lateral: Exterior chapa",
        "Chapa de lateral: Exterior chapa Cincalum",
      );
    }
  }

  if (includes_gate && structure_type === "Galpón") {
    gates_measurements.forEach(
      (gate) =>
        (details += `Portón corredizo de ${gate.height} x ${gate.width}mts;`),
    );
  }

  if (has_gutter) {
    details += `${gutter_metters}mts de canaletas;`;
  }

  return details;
};

/**
 * Returns the MIME type for a given file URL based on its extension.
 *
 * @param {string} url - The URL or filename.
 * @returns {string} MIME type string.
 */
export function getMimeTypeFromUrl(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpg";
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "ico":
      return "image/x-icon";
    default:
      return "image/png";
  }
}

/**
 * Generates an array of description strings for each silo.
 *
 * @param {Silos} silos - Array of silo objects.
 * @returns {string[]} Array of silo descriptions.
 */
export function getSilosDescriptions(silos: Silos): string[] {
  return silos.map((silo) => {
    const typeMap = silosMap[silo.type as keyof typeof silosMap];

    let baseDescription =
      typeMap && silo.capacity in typeMap
        ? typeMap[silo.capacity as keyof typeof typeMap]
        : "Silo no definido";

    // ✅ FEEDER SILOS → base de fibra
    if (
      silo.type === "feeder_silos" &&
      silo.has_fiber_base === true &&
      VALID_FIBER_BASE_CAPACITIES.includes(silo.capacity)
    ) {
      // Reemplaza "base Xmts diámetro" → "base de fibra Xmts diámetro"
      baseDescription = baseDescription.replace(
        /base\s([\d.,]+mts)\sdiámetro/,
        "base de fibra $1 diámetro",
      );
    }

    // 🔹 AIRBASE SILOS → lógica existente de cono
    if (
      silo.type !== "airbase_silos" ||
      !silo.cone_base ||
      silo.cone_base === "estandar"
    ) {
      return baseDescription;
    }

    const adjustmentMap = coneAdjustments[silo.capacity];
    if (adjustmentMap && adjustmentMap[silo.cone_base]) {
      const newCone = adjustmentMap[silo.cone_base];

      return baseDescription.replace(/cono\s\d+°\saltura\s[^,]+/, newCone);
    }

    return `${baseDescription}, base cono: ${silo.cone_base}°`;
  });
}

/**
 * Returns a default textual description for a structure based on its dimensions.
 *
 * @param {string} structure_type - Type of the structure.
 * @param {number} width - Width in meters.
 * @param {number} length - Length in meters.
 * @param {number} height - Height in meters.
 * @param {number[]} enclousure_height - Array of enclosure heights.
 * @returns {string} Description string.
 */
export const getStructureDefaultDescription = (
  structure_type: string,
  width: number,
  length: number,
  height: number,
  enclousure_height: number[],
) => {
  const isUniform = enclousure_height.every(
    (val) => val === enclousure_height[0],
  );
  if (structure_type !== "Galpón") {
    return `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre`;
  }

  const base = `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre con `;

  if (isUniform) {
    return `${base}${enclousure_height[0]}mts de cerramiento de chapa en los laterales.`;
  }

  return `${base}${enclousure_height[0]}mts de cerramiento de chapa lateral izquierdo, ${enclousure_height[1]}mts de cerramiento de chapa lateral derecho, ${enclousure_height[2]}mts de cerramiento de chapa frontal, y ${enclousure_height[3]}mts de cerramiento de chapa trasero`;
};

// Helper: devuelve true si todos los valores del array de alturas son iguales
/**
 * Checks if all enclosure heights are equal.
 *
 * @param {number[]} enclousure_height - Array of heights.
 * @returns {boolean} True if uniform, false otherwise.
 */
export const isEnclosureUniform = (enclousure_height: number[]) =>
  enclousure_height.every((val) => val === enclousure_height[0]);

/**
 * Generates a default caption based on inclusion flags.
 *
 * @param {boolean} includes_freight - Freight inclusion flag.
 * @param {boolean} includes_taxes - Tax inclusion flag.
 * @param {number} iva_percentage - IVA percentage.
 * @param {"silo" | "structure"} type - Budget type.
 * @returns {string} Caption string.
 */
export const getDefaultCaption = (
  includes_freight: boolean,
  includes_taxes: boolean,
  iva_percentage: number,
  type: "silo" | "structure",
) => {
  return `${
    includes_freight
      ? "* El precio incluye el flete"
      : "* El precio no incluye el flete"
  }; * Montaje incluido; ${
    type === "structure" ? "* No incluye hormigón para las columnas" : ""
  }; ${
    includes_taxes
      ? `* Incluye IVA ${iva_percentage}%`
      : `* No Incluye IVA ${iva_percentage}%`
  };
    `;
};

/**
 * Calculates total price in ARS including markup.
 *
 * @param {number} total - Base total in USD.
 * @param {number} dollar_quote - Current USD to ARS rate.
 * @param {number} budget_markup - Budget markup percentage.
 * @returns {number} Total price in ARS.
 */
export const getTotalArs = (
  total: number,
  dollar_quote: number,
  budget_markup: number,
) => {
  return total * dollar_quote * (1 + budget_markup / 100);
};

/**
 * Converts a value from ARS to USD applying markups.
 *
 * @param {number} value - Value in ARS.
 * @param {number} dollar_quote - USD to ARS rate.
 * @param {number} default_markup - Default markup percentage.
 * @param {number} budget_markup - Budget markup percentage.
 * @returns {number} Value in USD.
 */
export const priceInUSD = (
  value: number,
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
) => {
  return (
    value /
    dollar_quote /
    (1 + default_markup / 100) /
    (1 + budget_markup / 100)
  );
};

/**
 * Converts a value from USD to ARS applying markups.
 *
 * @param {number} value - Value in USD.
 * @param {number} dollar_quote - USD to ARS rate.
 * @param {number} default_markup - Default markup percentage.
 * @param {number} budget_markup - Budget markup percentage.
 * @returns {number} Value in ARS.
 */
export const priceInARS = (
  value: number,
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
) => {
  return (
    value *
    dollar_quote *
    (1 + default_markup / 100) *
    (1 + budget_markup / 100)
  );
};
