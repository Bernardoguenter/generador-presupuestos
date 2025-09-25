import { DeleteBudgetButton } from "./DeleteBudgetButton";
import { CustomLink } from "../../../../components";
import { EditIcon } from "../../../../assets/svg";
import type { SiloBudget, StructureBudget } from "../../../../helpers/types";

interface Props {
  budgets: StructureBudget[] | SiloBudget[];
  paginatedBudgets: StructureBudget[] | SiloBudget[];
  removeBudget: (id: string) => void;
  type: "silo" | "structure";
}

export const BudgetsTable = ({
  budgets,
  paginatedBudgets,
  removeBudget,
  type,
}: Props) => {
  return (
    <>
      {type === "structure" && (
        <StructureBudgetTable
          budgets={budgets}
          paginatedBudgets={paginatedBudgets}
          removeBudget={removeBudget}
          type={type}
        />
      )}
      {type === "silo" && (
        <SiloBudgetTable
          budgets={budgets}
          paginatedBudgets={paginatedBudgets}
          removeBudget={removeBudget}
          type={type}
        />
      )}
    </>
  );
};

const SiloBudgetTable = ({
  budgets,
  paginatedBudgets,
  removeBudget,
  type,
}: Props) => {
  return (
    <table className="max-w-full shadow-md overflow-hidden border rounded divide-y divide-gray-100">
      <thead className="rounded">
        <tr className="flex items-center w-full ">
          <th className="px-2 py-2 text-left text-sm font-medium  w-6/16">
            Cliente
          </th>
          <th className="px-2 py-2 text-left text-sm font-medium  w-6/16">
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
          (paginatedBudgets as SiloBudget[])?.map((budget) => (
            <tr
              key={budget.id}
              className="flex items-center w-full ">
              <td className="px-2 py-2 text-xs overflow-hidden w-6/16">
                {budget.customer.length > 0 ? budget.customer : "-"}
              </td>
              <td className="px-2 py-2 text-xs overflow-hidden w-6/16">
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
                  href={`silo/${budget.id}`}
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

const StructureBudgetTable = ({
  budgets,
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
          (paginatedBudgets as StructureBudget[])?.map((budget) => (
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
                  href={`structure/${budget.id}`}
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
