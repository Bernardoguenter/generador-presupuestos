import { useEffect, useState } from "react";
import type { SiloBudget, StructureBudget } from "../../../helpers/types";
import { useLocation, useParams } from "react-router";
import { getBudgetById } from "../../../common/lib";
import { PDFViewComponent } from "./PDFViewComponent";
import { Button, CustomLink } from "../../../components";
import { DownloadBudgetButton } from "./DownloadBudgetButton";
import { BudgetEditForm } from "./BudgetEditForm";
import { usePDFContext } from "../../../common/context";
import { SiloBudgetEditForm } from "./SiloBudgetEditForm";

export default function BudgetDetail() {
  const { id } = useParams();
  const location = useLocation();
  const pathType = location.pathname.includes("/structure/")
    ? "structure"
    : "silo";
  const [budget, setBudget] = useState<StructureBudget | SiloBudget | null>(
    null
  );
  const [viewDetail, setViewDetail] = useState(false);
  const { setPdfInfo, pdfInfo } = usePDFContext();

  const getBudget = async (id: string, type: "structure" | "silo") => {
    try {
      const { data, error } = await getBudgetById(id, type);
      if (!error) {
        setBudget(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      const pathType = location.pathname.includes("/structure/")
        ? "structure"
        : "silo";

      getBudget(id, pathType);
    }
  }, [id, location.pathname]);

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
          location.pathname.includes("/structure/") ? (
            <BudgetEditForm
              budget={budget as StructureBudget}
              getBudget={getBudget}
              handleView={handleView}
              viewDetail={viewDetail}
            />
          ) : location.pathname.includes("/silo/") ? (
            <SiloBudgetEditForm
              budget={budget as SiloBudget}
              getBudget={getBudget}
              handleView={handleView}
              viewDetail={viewDetail}
            />
          ) : null
        ) : (
          <PDFViewComponent
            budget={budget}
            type={pathType}
          />
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
