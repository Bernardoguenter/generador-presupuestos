import { useEffect, useState } from "react";
import { getStructureRenders, type StructureRenders } from "@/helpers";
import type { StructureBudget } from "@/types";

/** Genera las fotos 3D y los croquis del presupuesto de galpón/tinglado. */
export const useStructureRenders = (budget: StructureBudget | null) => {
  const [renders, setRenders] = useState<StructureRenders | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!budget) {
      setRenders(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getStructureRenders(budget).then((result) => {
      if (cancelled) return;
      setRenders(result);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [budget]);

  return { renders, isLoading };
};
