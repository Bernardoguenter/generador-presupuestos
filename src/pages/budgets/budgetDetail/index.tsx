import { useEffect, useState } from "react";
import type { Budget } from "../../../helpers/types";
import { useParams } from "react-router";
import { getBudgetById } from "../../../common/lib";
import { PDFViewComponent } from "./PDFViewComponent";
import { BudgetDetailComponent } from "./BudgetDetail";

export default function BudgetDetail() {
  const { id } = useParams();
  const [budget, setBudget] = useState<Budget | null>(null);

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
    <section className="w-full flex flex-col lg:flex-row justify-between gap-4 ">
      <BudgetDetailComponent budget={budget} />
      <PDFViewComponent budget={budget} />
    </section>
  );
}
