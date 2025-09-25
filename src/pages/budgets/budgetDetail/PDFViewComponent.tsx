import type { SiloBudget, StructureBudget } from "../../../helpers/types";
import { BudgetHeader } from "./BudgetHeader";
import { BudgetFooter } from "./BudgetFooter";
import { BudgetBody } from "./BudgetBody";
import { BudgetTable } from "./BudgetTable";

interface Props {
  budget: StructureBudget | SiloBudget;
  type?: "silo" | "structure";
}

export const PDFViewComponent = ({ budget, type = "structure" }: Props) => {
  return (
    <div
      id="pdf"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        boxSizing: "border-box",
      }}
      className="overflow-hidden p-4 lg:p-8 lg:w-1/2 w-full max-h-max max-w-[20cm]">
      <BudgetHeader customer={budget.customer} />
      <BudgetTable
        type={type}
        budget={budget}
      />
      {type === "silo" && (
        <BudgetBody
          caption={budget.caption}
          paymentMethods={budget.paymentMethods}
        />
      )}
      {type === "structure" && (
        <BudgetBody
          caption={budget.caption}
          details={(budget as StructureBudget).details}
          paymentMethods={budget.paymentMethods}
        />
      )}

      <BudgetFooter />
    </div>
  );
};
