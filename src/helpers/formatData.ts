import { coneAdjustments, materialsMap, silosMap } from "./staticData";
import type { GatesMeasurements, Silos } from "./types";

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

export const formatFileType = (file: File) => {
  return file.type.split("/").pop();
};

export const formatDate = (date: string) => {
  const newDate = new Date(date);

  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatNumber = (num: number) => {
  const valorFormateado = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
  }).format(num);
  return valorFormateado;
};

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

const getHierroTorsionado = (width: number, details: string) => {
  /*   if (width <= 8) {
    return details
      .replace("hierro torsionado n.º 16", "hierro torsionado n.º 12")
      .replace(
        "hierro torsionado n.º 10 y n.º 8",
        "hierro torsionado n.º 8 y n.º 8"
      );
  } */
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

export function getSilosDescriptions(silos: Silos): string[] {
  return silos.map((silo) => {
    const typeMap = silosMap[silo.type as keyof typeof silosMap];
    const baseDescription =
      typeMap && silo.capacity in typeMap
        ? typeMap[silo.capacity as keyof typeof typeMap]
        : "Silo no definido";

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

      // reemplazamos dinámicamente la parte del cono en la descripción original
      return baseDescription.replace(/cono\s\d+°\saltura\s[^,]+/, newCone);
    }

    return `${baseDescription}, base cono: ${silo.cone_base}°`;
  });
}

export const getStructureDefaultDescription = (
  structure_type: string,
  width: number,
  length: number,
  height: number,
  enclousure_height: number,
) => {
  return structure_type === "Galpón"
    ? `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre con ${enclousure_height}mts cerramiento de chapa en los laterales.`
    : `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre`;
};

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

export const getTotalArs = (
  total: number,
  dollar_quote: number,
  budget_markup: number,
) => {
  return total * dollar_quote * (1 + budget_markup / 100);
};

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
