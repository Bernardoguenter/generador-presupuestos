import { useEffect, useState } from "react";
import type { Budget } from "../../../helpers/types";
import { useParams } from "react-router";
import { getBudgetById } from "../../../common/lib";
import { PDFViewComponent } from "./PDFViewComponent";
import { BudgetDetailComponent } from "./BudgetDetail";
import { Button, CustomLink } from "../../../components";
import { DownloadBudgetButton } from "./DownloadBudgetButton";
import { SendBudgetButton } from "./SendBudgetButton";

export default function BudgetDetail() {
  const { id } = useParams();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [viewDetail, setViewDetail] = useState(false);

  useEffect(() => {
    if (id) {
      const getBudget = async () => {
        const { data, error } = await getBudgetById(id);
        if (!error) {
          setBudget(data);
        }
      };
      getBudget();
    }
  }, [id]);

  if (!budget) return <p>No se ha obtenido un Presupuesto</p>;

  return (
    <section>
      <Button
        color="danger"
        styles="mt-4 w-1/2"
        onClick={() => setViewDetail(!viewDetail)}>
        {viewDetail ? "Ocultar Detalle" : "Ver Detalle"}
      </Button>
      <div className="w-full flex flex-col lg:flex-row justify-between gap-4 mt-4">
        {viewDetail && <BudgetDetailComponent budget={budget} />}
        <PDFViewComponent budget={budget} />
      </div>
      <div className="mt-4 flex flex-col  gap-2 lg:w-2/5 ">
        <DownloadBudgetButton customer={budget.customer} />
        <SendBudgetButton customer={budget.customer} />
        <CustomLink
          href="/budgets/calculator"
          color="danger"
          styles="text-center font-bold">
          Nuevo Presupuesto
        </CustomLink>
      </div>
    </section>
  );
}
