import { useEffect, useState } from "react";
import { Pagination, SearchInput } from "../../../../components";
import { useAuthContext } from "../../../../common/context";
import type { StructureBudget } from "../../../../helpers/types";
import { getAllBudgets } from "../../../../common/lib";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";
import { BudgetsTable } from "./BudgetsTable";

export const BudgetsHistoryList = () => {
  const [budgets, setBudgets] = useState<StructureBudget[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getBudgets = async () => {
      try {
        setIsLoading(true);
        if (authUser?.id) {
          const { data, error } = await getAllBudgets(authUser.id);
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
  } = UseSearchableTable<StructureBudget>({
    data: budgets || [],
    filterFn: (budget, search) =>
      [
        budget.address?.address,
        budget.customer,
        budget.structure_type,
        budget.width?.toString(),
        budget.height?.toString(),
        budget.length?.toString(),
      ]
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
