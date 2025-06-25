import { CustomLink } from "../../../components";
import { BudgetsHistoryList } from "./components/BudgetsHistoryList";

export default function BudgetHistory() {
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
      <BudgetsHistoryList />
    </section>
  );
}
