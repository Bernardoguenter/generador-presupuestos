import { useEffect, useState } from "react";
import { EditIcon } from "../../../../assets/svg";
import { CustomLink } from "../../../../components";
import { useAuthContext } from "../../../../common/context";
import type { Budget } from "../../../../helpers/types";
import { getAllBudgets } from "../../../../common/lib";
import { DeleteBudgetButton } from "./DeleteBudgetButton";

export const BudgetsHistoryList = () => {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getBudgets = async () => {
      if (authUser?.id) {
        const { data, error } = await getAllBudgets(authUser?.id);

        if (!error) {
          setBudgets(data);
        }
        setIsLoading(false);
      }
    };
    getBudgets();
  }, [authUser?.id, isLoading]);

  return (
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
              No se encontraron presupuestos de esta empresa
            </td>
          </tr>
        ) : (
          budgets?.map((budget) => (
            <tr
              key={budget.id}
              className="flex items-center w-full ">
              <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                {budget.customer}
              </td>
              <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                {budget.width} x {budget.height} x {budget.length} mts
              </td>
              <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                {budget.structure_type}
              </td>
              <td className="px-2 py-2 text-xs overflow-hidden w-3/16">
                {budget.address.address}
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
  );
};
