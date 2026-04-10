import { Pagination, SearchInput } from "@/components";
import { type SiloBudget } from "@/types";
import { BudgetsTable } from "./BudgetsTable";
import { useBudgetsHistory } from "./hooks/useBudgetsHistory";

export const SiloBudgetsHistoryList = () => {
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
  } = useBudgetsHistory<SiloBudget>("silo");

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
