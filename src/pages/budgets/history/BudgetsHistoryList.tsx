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

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {isLoading && (
        <p className="px-1 text-sm text-gray-300">Actualizando presupuestos...</p>
      )}
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
