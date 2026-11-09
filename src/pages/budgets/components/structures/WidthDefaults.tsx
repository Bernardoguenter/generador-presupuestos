import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  getStructureDefaultsByWidth,
  widthCategory,
} from "@/helpers/structureDefaults";
import type { GatesMeasurements } from "@/types";

/**
 * Cuando el ancho pasa de "hasta 12 m" a "más de 12 m" (o al revés), pone el
 * alto, el cerramiento y la medida del portón por defecto. Si después se
 * cambian a mano, se respetan hasta que el ancho vuelva a cambiar de rango.
 */
export const WidthDefaults = () => {
  const { control, setValue, getValues } = useFormContext();
  const width = useWatch({ control, name: "width" });
  const lastCategory = useRef<string | null>(null);

  useEffect(() => {
    const w = typeof width === "string" ? parseFloat(width) : Number(width);
    if (!w || isNaN(w)) return;
    const category = widthCategory(w);
    // la primera vez (presupuesto nuevo o editado) no se pisa nada
    if (lastCategory.current === null) {
      lastCategory.current = category;
      return;
    }
    if (lastCategory.current === category) return;
    lastCategory.current = category;

    const d = getStructureDefaultsByWidth(w);
    setValue("height", d.height, { shouldValidate: true });
    setValue("enclousure_height", [d.enclousure, d.enclousure, d.enclousure, d.enclousure]);
    setValue("uniform_enclousure", true);
    const gates = (getValues("gates_measurements") ?? []) as GatesMeasurements[];
    if (gates.length) {
      setValue(
        "gates_measurements",
        gates.map(() => ({ ...d.gate })),
      );
    }
  }, [width, setValue, getValues]);

  return null;
};
