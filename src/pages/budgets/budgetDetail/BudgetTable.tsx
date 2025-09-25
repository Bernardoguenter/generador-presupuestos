import type { SiloBudget, StructureBudget } from "../../../helpers/types";
import { BudgetSiloTable } from "./BudgetSiloTable";
import { BudgetStructureTable } from "./BudgetStructureTable";

interface Props {
  type: "silo" | "structure";
  budget: StructureBudget | SiloBudget;
}

export const BudgetTable = ({ type, budget }: Props) => {
  return (
    <>
      {type === "structure" && (
        <BudgetStructureTable budget={budget as StructureBudget} />
      )}
      {type === "silo" && <BudgetSiloTable budget={budget as SiloBudget} />}
    </>
  );
};
