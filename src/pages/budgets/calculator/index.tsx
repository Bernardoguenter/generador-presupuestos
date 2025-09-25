import { useState } from "react";
import { StructureBudgetCalculatorForm } from "./StructureBudgetCalculatorForm";
import { BudgetViewButtons } from "./BudgetViewButtons";
import { SiloBudgetCalculatorForm } from "./SiloBudgetCalculatorForm";

export default function Calculator() {
  const [budgetType, setBudgetType] = useState<"structure" | "silo">(
    "structure"
  );
  return (
    <>
      <aside className="my-4 flex justify-between items-center">
        <h2 className="my-4 text-2xl font-medium">Nuevo Presupuesto</h2>
        <BudgetViewButtons
          budgetType={budgetType}
          setBudgetType={setBudgetType}
        />
      </aside>
      {budgetType === "structure" && <StructureBudgetCalculatorForm />}
      {budgetType === "silo" && <SiloBudgetCalculatorForm />}
    </>
  );
}
