import { useEffect, useState } from "react";
import type { Budget } from "../../../helpers/types";
import { useParams } from "react-router";
import { getBudgetById } from "../../../common/lib";
import { PDFViewComponent } from "./PDFViewComponent";
import { Button, CustomLink } from "../../../components";
import { DownloadBudgetButton } from "./DownloadBudgetButton";
import { BudgetEditForm } from "./BudgetEditForm";
import { usePDFContext } from "../../../common/context";

export default function BudgetDetail() {
  const { id } = useParams();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [viewDetail, setViewDetail] = useState(false);
  const { setPdfInfo, pdfInfo } = usePDFContext();

  const getBudget = async (id: string) => {
    try {
      const { data, error } = await getBudgetById(id);
      if (!error) {
        setBudget(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      getBudget(id);
    }
  }, [id]);

  const handleView = () => {
    setViewDetail(!viewDetail);
    if (pdfInfo) {
      setPdfInfo(null);
    }
  };

  if (!budget) return <p>No se ha obtenido un Presupuesto</p>;

  return (
    <section>
      <div className="w-full lg:w-1/2">
        <Button
          color="danger"
          styles="mt-4 w-1/2"
          onClick={handleView}>
          {viewDetail ? "Cancelar" : "Editar Formulario"}
        </Button>
      </div>

      <div className="w-full flex flex-col lg:flex-row justify-between gap-4 mt-4">
        {viewDetail ? (
          <BudgetEditForm
            budget={budget}
            getBudget={getBudget}
            handleView={handleView}
            viewDetail={viewDetail}
          />
        ) : (
          <PDFViewComponent budget={budget} />
        )}
      </div>
      {!viewDetail && (
        <div className="mt-4 flex flex-col  gap-2 lg:w-2/5 ">
          <DownloadBudgetButton customer={budget.customer} />
          <CustomLink
            href="/budgets/calculator"
            color="danger"
            styles="text-center font-bold">
            Nuevo Presupuesto
          </CustomLink>
        </div>
      )}
    </section>
  );
}
