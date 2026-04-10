import { type StructureBudget } from "@/types";
import { DeleteBudgetButton } from "./DeleteBudgetButton";
import { CustomLink } from "@/components";
import { EditIcon } from "@/assets/svg";

interface Props {
  paginatedBudgets: StructureBudget[];
  removeBudget: (id: string) => void;
  type: "structure";
}

export const StructureBudgetTable = ({
  paginatedBudgets,
  removeBudget,
  type,
}: Props) => {
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
          <th className="px-2 py-2 w-2/16"></th>
          <th className="px-2 py-2 w-2/16"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {paginatedBudgets.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="text-center py-4">
              No se encontraron presupuestos
            </td>
          </tr>
        ) : (
          paginatedBudgets.map((budget) => (
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
                  type={type}
                  removeBudget={removeBudget}
                />
              </td>
              <td className="px-2 py-2 flex justify-center items-center w-2/16">
                <CustomLink
                  href={`/budgets/structures/${budget.id}`}
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
