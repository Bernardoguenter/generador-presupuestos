import { useEffect, useState } from "react";
import { EditIcon } from "../../../../assets/svg";
import { CustomLink, Pagination, SearchInput } from "../../../../components";
import { useAuthContext } from "../../../../common/context";
import type { Budget } from "../../../../helpers/types";
import { getAllBudgets } from "../../../../common/lib";
import { DeleteBudgetButton } from "./DeleteBudgetButton";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";

export const BudgetsHistoryList = () => {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
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

  const {
    searchInput,
    setSearchInput,
    filteredData: filteredBudgets,
  } = UseSearchableTable<Budget>({
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
  }, [searchInput]);

  const paginatedBudgets = paginatedData;

  if (isLoading) return <p>Cargando listado de Presupuestos</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <table className="max-w-full shadow-md overflow-hidden border rounded divide-y divide-gray-100">
        <thead className="rounded">
          <tr className="flex items-center w-full ">
            <th className="px-2 py-2 text-left text-sm font-medium w-3/16">
              Cliente
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium w-3/16">
              Medidas
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium w-3/16">
              Estructura
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium w-3/16">
              Ubicación
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {budgets?.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center py-4">
                No se encontraron presupuestos
              </td>
            </tr>
          ) : (
            paginatedBudgets?.map((budget) => (
              <tr
                key={budget.id}
                className="flex items-center w-full ">
                <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                  {budget.customer.length > 0 ? budget.customer : "-"}
                </td>
                <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                  {budget.width} x {budget.height} x {budget.length} mts
                </td>
                <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                  {budget.structure_type}
                </td>
                <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                  {(budget.address && budget.address.address) || "-"}
                </td>
                <td className="px-2 py-2 flex justify-center items-center w-2/16">
                  <DeleteBudgetButton
                    id={budget.id}
                    setIsLoading={setIsLoading}
                  />
                </td>
                <td className="px-2 py-2 flex justify-center items-center w-2/16">
                  <CustomLink
                    href={`${budget.id}`}
                    styles="flex items-center justify-center">
                    <EditIcon />
                  </CustomLink>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
