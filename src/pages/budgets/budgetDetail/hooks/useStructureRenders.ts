import { useEffect, useState } from "react";
import { getStructureRenders, type StructureRenders } from "@/helpers";
import type { StructureBudget } from "@/types";

/** Genera las fotos 3D y los croquis del presupuesto de galpón/tinglado. */
export const useStructureRenders = (
  budget: StructureBudget | null,
  roofSlopes: 1 | 2 = 2,
) => {
  const [renders, setRenders] = useState<StructureRenders | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!budget) {
      setRenders(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getStructureRenders(budget, roofSlopes).then((result) => {
      if (cancelled) return;
      setRenders(result);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [budget, roofSlopes]);

  return { renders, isLoading };
};
