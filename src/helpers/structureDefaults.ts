import type { GatesMeasurements } from "@/types";

/**
 * Valores por defecto de Remeco según el ancho del galpón.
 * - Hasta 12 m de ancho: alto 4,5 m, cerramiento 4 m, portón 4,5 x 4,5 m.
 * - Más de 12 m: alto 5 m, cerramiento 4,5 m, portón 4,5 m de ancho x 5 m de alto.
 * Se pueden cambiar a mano en el formulario.
 */
export const getStructureDefaultsByWidth = (width: number) => {
  const grande = width > 12;
  return {
    height: grande ? 5 : 4.5,
    enclousure: grande ? 4.5 : 4,
    gate: (grande
      ? { width: 4.5, height: 5 }
      : { width: 4.5, height: 4.5 }) as GatesMeasurements,
  };
};

/** "chico" (hasta 12 m) o "grande" (más de 12 m) */
export const widthCategory = (width: number) =>
  Number(width) > 12 ? "grande" : "chico";
