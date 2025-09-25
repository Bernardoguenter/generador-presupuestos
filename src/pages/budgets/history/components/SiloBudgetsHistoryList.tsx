import { useEffect, useState } from "react";
import { Pagination, SearchInput } from "../../../../components";
import { useAuthContext } from "../../../../common/context";
import type { SiloBudget } from "../../../../helpers/types";
import { getAllBudgets } from "../../../../common/lib";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";
import { BudgetsTable } from "./BudgetsTable";

export const SiloBudgetsHistoryList = () => {
  const [budgets, setBudgets] = useState<SiloBudget[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getBudgets = async () => {
      try {
        setIsLoading(true);
        if (authUser?.id) {
          const { data, error } = await getAllBudgets(authUser.id, "silo");
          if (!error && data) {
            setBudgets(data);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getBudgets();
  }, [authUser?.id]);

  const removeBudget = (id: string) => {
    setBudgets((prev) => prev?.filter((budget) => budget.id !== id) || null);
  };

  const {
    searchInput,
    setSearchInput,
    filteredData: filteredBudgets,
  } = UseSearchableTable<SiloBudget>({
    data: budgets || [],
    filterFn: (budget, search) =>
      [budget.address?.address, budget.customer]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(search.toLowerCase())),
  });

  const {
    paginatedData,
    currentPage,
    handleNextPage,
    handlePrevPage,
    pageSize,
    setPageSize,
    totalPages,
    pages,
    setCurrentPage,
  } = usePaginatedData(filteredBudgets);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, setCurrentPage]);

  const paginatedBudgets = paginatedData;

  if (isLoading) return <p>Cargando listado de Presupuestos</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {budgets && (
        <BudgetsTable
          budgets={budgets}
          paginatedBudgets={paginatedBudgets}
          removeBudget={removeBudget}
          type={"silo"}
        />
      )}
      <Pagination
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        pages={pages}
        setPageSize={setPageSize}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};
