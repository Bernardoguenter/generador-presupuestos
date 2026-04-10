import type { SiloBudget, StructureBudget } from "@/types";
import { SiloBudgetTable } from "./SiloBudgetTable";
import { StructureBudgetTable } from "./StructureBudgetTable";

interface Props {
  budgets: StructureBudget[] | SiloBudget[];
  paginatedBudgets: StructureBudget[] | SiloBudget[];
  removeBudget: (id: string) => void;
  type: "silo" | "structure";
}

export const BudgetsTable = ({
  paginatedBudgets,
  removeBudget,
  type,
}: Props) => {
  return (
    <>
      {type === "structure" && (
        <StructureBudgetTable
          paginatedBudgets={paginatedBudgets as StructureBudget[]}
          removeBudget={removeBudget}
          type={type}
        />
      )}
      {type === "silo" && (
        <SiloBudgetTable
          paginatedBudgets={paginatedBudgets as SiloBudget[]}
          removeBudget={removeBudget}
          type={type}
        />
      )}
    </>
  );
};
