import { useMemo } from "react";
import { BudgetPeriodFilter, Pagination, SearchInput } from "@/components";
import { useBudgetCounts } from "@/common/hooks";
import { getBudgetPeriodLabel } from "@/helpers/budgetPeriods";
import { useUserList } from "../../hooks";
import { UserTable } from "./UserTable";

export const UserList = () => {
  const {
    users,
    paginatedUsers,
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
    removeUser,
  } = useUserList();

  const userIds = useMemo(
    () => (paginatedUsers ?? []).map((u) => u.id),
    [paginatedUsers],
  );
  const { period, day, counts, isLoading: countsLoading, onChange } =
    useBudgetCounts(userIds);
  const totalBudgets = Object.values(counts).reduce((a, c) => a + c.total, 0);

  if (isLoading) return <p>Cargando listado de usuarios</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <div className="flex flex-col gap-2 border rounded p-3">
        <p className="text-sm font-medium">Presupuestos por persona</p>
        <BudgetPeriodFilter
          period={period}
          day={day}
          onChange={onChange}
        />
        <p className="text-xs opacity-80">
          {countsLoading
            ? "Contando presupuestos..."
            : `${totalBudgets} presupuestos ${getBudgetPeriodLabel(period, day)} entre los usuarios de esta página.`}
        </p>
      </div>
      {users && (
        <UserTable
          counts={counts}
          countsLoading={countsLoading}
          paginatedUsers={paginatedUsers}
          users={users}
          removeUser={removeUser}
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
