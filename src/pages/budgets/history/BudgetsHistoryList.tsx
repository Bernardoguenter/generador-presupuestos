import { Pagination, SearchInput } from "@/components";
import { type StructureBudget } from "@/types";
import { BudgetsTable } from "./BudgetsTable";
import { useBudgetsHistory } from "./hooks/useBudgetsHistory";

export const BudgetsHistoryList = () => {
  const {
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
  } = useBudgetsHistory<StructureBudget>("structure");

  if (isLoading) return <p className="p-4">Cargando listado de Presupuestos</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {budgets && (
        <BudgetsTable
          budgets={budgets}
          paginatedBudgets={budgets}
          removeBudget={removeBudget}
          type="structure"
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
