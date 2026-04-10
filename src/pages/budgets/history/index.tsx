import { Outlet, useLocation, useNavigate } from "react-router";
import { CustomLink } from "@/components";
import { BudgetViewButtons } from "../calculator/BudgetViewButtons";

export default function BudgetHistory() {
  const location = useLocation();
  const navigate = useNavigate();

  const budgetType = location.pathname.includes("/budgets/silos") ? "silo" : "structure";

  const setBudgetType = (type: "structure" | "silo") => {
    navigate(`/budgets/${type === "silo" ? "silos" : "structures"}`, { replace: true, viewTransition: true });
  };

  return (
    <section className="py-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Listado de Presupuestos</h2>
        <CustomLink
          href="/budgets/calculator"
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
      <Outlet />
    </section>
  );
}
