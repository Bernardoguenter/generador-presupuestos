import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router";
import { getBudgetById } from "@/common/lib";
import { type SiloBudget, type StructureBudget } from "@/types";
import { usePDFContext } from "@/common/context";

export const useBudgetDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { setPdfInfo, pdfInfo } = usePDFContext();
  
  const [budget, setBudget] = useState<StructureBudget | SiloBudget | null>(null);
  const [viewDetail, setViewDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const budgetType = (location.pathname.includes("/structures/")
    ? "structure"
    : "silo") as "structure" | "silo";

  const fetchBudget = useCallback(async (id: string, type: "structure" | "silo") => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await getBudgetById(id, type);
      if (error) {
        setError("No se pudo obtener el presupuesto");
      } else {
        setBudget(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado al obtener el presupuesto");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchBudget(id, budgetType);
    }
  }, [id, budgetType, fetchBudget]);

  const handleViewToggle = useCallback(() => {
    setViewDetail((prev) => !prev);
    if (pdfInfo) {
      setPdfInfo(null);
    }
  }, [pdfInfo, setPdfInfo]);

  return {
    budget,
    budgetType,
    viewDetail,
    isLoading,
    error,
    handleViewToggle,
    fetchBudget,
    pathName: location.pathname
  };
};
