import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/common/context";
import { getAllBudgets } from "@/common/lib";
import { usePaginatedData, useDebounce, useSearchableTable } from "@/common/hooks";
import type { SiloBudget, StructureBudget } from "@/types";

type BudgetType = "structure" | "silo";

export const useBudgetsHistory = <T extends StructureBudget | SiloBudget>(type: BudgetType) => {
  const [budgets, setBudgets] = useState<T[] | null>(null);
  const [serverTotalCount, setServerTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authUser } = useAuthContext();

  const {
    searchInput,
    setSearchInput,
  } = useSearchableTable<T>({
    data: [],
    filterFn: () => true,
  });

  const {
    currentPage,
    handleNextPage,
    handlePrevPage,
    pageSize,
    setPageSize,
    totalPages,
    pages,
    setCurrentPage,
  } = usePaginatedData(budgets, 10, serverTotalCount);

  const debouncedSearch = useDebounce(searchInput, 500);

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      if (authUser?.id) {
        const { data, error, count } = await getAllBudgets(
          authUser.id,
          type,
          currentPage,
          pageSize,
          debouncedSearch,
        );
        if (!error && data) {
          setBudgets(data as T[]);
          setServerTotalCount(count || 0);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id, currentPage, pageSize, debouncedSearch, type]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const removeBudget = useCallback((id: string) => {
    setBudgets((prev) => prev?.filter((budget) => budget.id !== id) as T[] | null);
    setServerTotalCount((prev) => prev - 1);
  }, []);

  return {
    budgets,
    isLoading,
    searchInput,
    setSearchInput,
    currentPage,
    handleNextPage,
    handlePrevPage,
    pageSize,
    setPageSize,
    totalPages,
    pages,
    setCurrentPage,
    removeBudget,
  };
};
