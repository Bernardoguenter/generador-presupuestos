import { useState } from "react";
import { CustomLink } from "@/components";
import { BudgetViewButtons } from "../calculator/BudgetViewButtons";
import { BudgetsHistoryList } from "./BudgetsHistoryList";
import { SiloBudgetsHistoryList } from "./SiloBudgetsHistoryList";

export default function BudgetHistory() {
  const [budgetType, setBudgetType] = useState<"structure" | "silo">(
    "structure"
  );

  return (
    <section className="py-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Listado de Presupuestos</h2>
        <CustomLink
          href="calculator"
          color="danger"
          styles="self-end">
          Nuevo presupuesto
        </CustomLink>
      </div>
      <aside className="flex justify-end items-center">
        <BudgetViewButtons
          budgetType={budgetType}
          setBudgetType={setBudgetType}
        />
      </aside>
      {budgetType === "structure" && <BudgetsHistoryList />}
      {budgetType === "silo" && <SiloBudgetsHistoryList />}
    </section>
  );
}
